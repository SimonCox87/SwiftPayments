// import of the following code from react and firestore modules.  CustomerTable is our table component
// which has it's own script.
import React from "react";
import Header from "./components/Header";
import TableHeader from "./components/TableHeader";
import CustomerTable from "./components/CustomerTable";
import Companies from "./components/Companies";
import Contact from "./components/Contact";
import Locations from "./components/Locations";
import { onSnapshot, addDoc, doc, setDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { companies, customers, db } from "./firebase";

// Create our main App function, which holds our data, functions and basic html structure for our
// components and corresponding html/JSX elements.
function App() {
  // React use States.  Contain an array and a setter function.  When these states are changed using their
  // prescribed setting functions Reacts DOM is updated causing re-render of page to reflect change in state.  Essentially when
  // the data is changed the webpage and it's underlying components will be altered to reflect this change.
  const [customerData, setCustomerData] = React.useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [customerId, setCustomerId] = React.useState(null);
  const [tempText, setTempText] = React.useState({});
  const [debounceTimeouts, setDebounceTimeouts] = React.useState({});
  const [page, setPage] = React.useState(null);

  // Load data from firebase and close when session is over
  React.useEffect(() => {
    const unsubscribe = onSnapshot(customers, function (snapshot) {
      // Sync up our local customerData array with the snapshot data and sort by time added
      const customerArr = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.created - b.created);

      setCustomerData(customerArr); // Initialise customerData with customerArr
    });
    return unsubscribe;
  }, []);

  // Ensure that table remains filtered when a new call and response is made to firestore
  React.useEffect(() => {
    setFilteredCustomerData(
      filterStatus === "All"
        ? customerData
        : customerData.filter((customer) => customer.status === filterStatus)
    );
  }, [customerData, filterStatus]);

  // Select customer ID.  Radio button handler function
  function selectId(id) {
    setCustomerId(id);
  }

  // Delete function to remove customer record from the database
  async function del() {
    if (!customerId) {
      alert("Please select a customer to delete.");
      return;
    }

    // Create collections array
    const collectionNames = ["customers", "companies"];

    // Loop through the collections with the help of the collectionNames array
    for (const collectionName of collectionNames) {
      // Create a batch instance.  This instance will collect all the write operations
      // (additions, updates,deletions) until they are committed so that they are all
      // executed simultaneously
      const batch = writeBatch(db);

      // Delete customers collection first, as the collection does not have a linkedCustomerId
      // field like the other collections do
      if (collectionName === "customers") {
        // Create the docref to be added to batch
        const docRef = doc(db, "customers", customerId);
        // Send the document to batch
        batch.delete(docRef);
      } else {
        // Define a query to find documents with linkedCustomerId matching the customerId
        const collRef = collection(db, collectionName);
        const companiesQuery = query(
          collRef,
          where("linkedCustomerId", "==", customerId)
        );

        // Execute the query to get matching documents
        const querySnapshot = await getDocs(companiesQuery);
        const docRef = querySnapshot.docs[0].ref;
        batch.delete(docRef);
      }
      // Commit the batch delete operation
      await batch.commit();
    }
    setCustomerId(null); // Clear customerId after deletion
  }

  // Function to add new customer record to the database.  Ready for the user to add the data
  async function add() {
    const newCustomer = {
      companyName: null,
      tradingName: null,
      contactName: null,
      telNumber: null,
      email: null,
      merchantId: null,
      bankNumber: null,
      status: null,
      created: Date.now(),
    };
    // Add a new document to the Customers collection and get the document reference
    const docRef = await addDoc(customers, newCustomer);

    // Use the document ID and some fields from newCustomer to create linked data in other collections
    // Get the document ID of the newly created customer
    const customerId = docRef.id;

    // Create newCompany object which will form the basis of our new document for companies collection
    const newCompany = {
      linkedCustomerId: customerId, // linked customer id, linking back to the corresponding document in customers
      name: null,
      category: null,
      number: null,
      user: null,
      address: null,
    };

    // Add a related document in the Companies collection, using the customer ID and any relevant fields
    await addDoc(companies, newCompany);
  }

  // Function to amend existing customer data.
  async function amend(id, field, value) {
    const docRef = doc(db, "customers", id);
    await setDoc(docRef, { [field]: value }, { merge: true });
  }

  // Function to debounce the field update
  const debounceUpdate = (id, field, value) => {
    if (debounceTimeouts[id]) {
      clearTimeout(debounceTimeouts[id]); //cancels previously set timeout with the same id
    }

    const timeoutId = setTimeout(() => {
      if (tempText[id] && tempText[id][field] !== value) {
        amend(id, field, value); // Call amend to update Firestore if tempText is different to value.
      }
    }, 500); // 500ms debounce time

    // Updates debounceTimeouts state with timeoutId
    setDebounceTimeouts((prevTimeouts) => ({
      ...prevTimeouts,
      [id]: timeoutId,
    }));
  };

  // Function to handle input changes and store them in tempText
  const handleUpdate = (id, field, value) => {
    setTempText({
      ...tempText,
      [id]: {
        ...tempText[id],
        [field]: value,
      },
    });

    // Debounce the actual update to Firestore
    debounceUpdate(id, field, value);
  };

  // Function that handles the filtering of the customer data by status.
  const handleFilter = (status) => {
    setFilterStatus(status);
    if (status === "All") {
      setFilteredCustomerData(customerData);
    } else {
      setFilteredCustomerData(
        customerData.filter((customer) => customer.status === status)
      );
    }
  };

  // Function to colour rows by status.  Result of each conditional (if) statement is the relevant css class.
  function rowColour(status) {
    if (status === "Declined") {
      return "row-declined";
    } else if (status === "Live") {
      return "row-live";
    } else if (status === "Application") {
      return "row-application";
    } else if (status === "Prospect") {
      return "row-prospect";
    }
  }

  // Create a dictionary object that contains all of our components
  const componentMap = {
    Companies: <Companies />,
    Contact: <Contact />,
    Locations: <Locations />,
    Deals: (
      <CustomerTable
        customerData={filteredCustomerData}
        selectId={selectId}
        handleUpdate={handleUpdate}
        rowColour={rowColour}
        customerId={customerId}
        filterStatus={filterStatus}
        handleFilter={handleFilter}
        tempText={tempText}
        amend={amend}
      />
    ),
  };

  // Function to render the different tables.  This function is executed in the return statement below.
  // In the return statement the function receives the page state as a parameter.
  function renderPage(table) {
    return componentMap[table] || componentMap["Deals"];
  }
  // Below elements are returned by app function.
  // 1. The TableHeader component is returned and its props are defined and passed to the component.
  // 2. The CustomerTable component is returned and its props are defined and passed to the component.

  // Tasks
  // 3. Create the Companies database - Refer to Chat GPT log and research this.

  return (
    <div>
      <Header setPage={setPage} />
      <TableHeader filterStatus={filterStatus} add={add} deleteDoc={del} />
      {renderPage(page)}
    </div>
  );
}

export default App;
