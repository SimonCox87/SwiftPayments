// import of the following code from react and firestore modules.  CustomerTable is our table component
// which has it's own script.
import React from "react";
import Header from "./components/Header";
import TableHeader from "./components/TableHeader";
import CustomerTable from "./components/CustomerTable";
import Companies from "./components/Companies";
import Contact from "./components/Contact";
import Locations from "./components/Locations";
import {
  onSnapshot,
  addDoc,
  doc,
  setDoc,
  query,
  collection,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { companies, customers, db } from "./firebase";

// Create our main App function, which holds our data, functions and basic html structure for our
// components and corresponding html/JSX elements.
function App() {
  // React use States.  Contain an array and a setter function.  When these states are changed using their
  // prescribed setting functions Reacts DOM is updated causing re-render of page to reflect change in state.  Essentially when
  // the data is changed the webpage and it's underlying components will be altered to reflect this change.
  const [customerData, setCustomerData] = React.useState([]);
  const [companyData, setCompanyData] = React.useState([]);
  const [filteredCustomerData, setFilteredCustomerData] = React.useState([]);
  const [filteredCompanyData, setFilteredCompanyData] = React.useState([]);
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [tempText, setTempText] = React.useState({});
  const [page, setPage] = React.useState(null);

  // React use References.  For values that persist between renders.  We use these so that when the values of these
  // references changes a re-render of the page is not triggered making for a more performant web page.
  const debounceTimeoutsRef = React.useRef({});
  const customerIdRef = React.useRef(null)  

  // Load customers n data from firebase and close when session is over
  React.useEffect(() => {
    const unsubscribeCustomers = onSnapshot(customers, function (snapshot) {
      // Sync up our local customerData array with the snapshot data and sort by time added
      const customerArr = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.created - b.created);

      setCustomerData(customerArr); // Initialise customerData with customerArr
    });
    return unsubscribeCustomers;
  }, []);

  // Load companies n data from firebase and close when session is over
  React.useEffect(() => {
    const unsubscribeCompanies = onSnapshot(companies, function (snapshot) {
      const companyArr = snapshot.docs
        .map((doc) => ({ ...doc.data(), id: doc.id }))
        .sort((a, b) => a.linkedCustomerCreated - b.linkedCustomerCreated);

      setCompanyData(companyArr);
    });
    return unsubscribeCompanies;
  }, []);

  // Ensure that tables remain filtered
  React.useEffect(() => {
    setFilteredCustomerData(
      filterStatus === "All"
        ? customerData
        : customerData.filter((customer) => customer.status === filterStatus)
    );
      
  }, [customerData, filterStatus]);

  React.useEffect(() => {
    setFilteredCompanyData(
      filterStatus === "All"
        ? companyData
        : companyData.filter((company) => company.linkedStatus === filterStatus)
    );
    console.log(`filter company - ${filterStatus}`)
  }, [companyData, filterStatus]);

  // React useEffect that syncs up companies and customers databases when changes are made
  // to the customers database
  React.useEffect(() => {
    // guard clause in case customerData and companyData do not exist or if the two
    // arrays are of unequal length
    if (
      !customerData ||
      !companyData ||
      customerData.length !== companyData.length
    ) {
      return;
    }

    for (let i = 0; i < customerData.length; i++) {
      if (customerData[i].companyName !== companyData[i].name) {
        amend(
          "companies",
          companyData[i].id,
          "name",
          `${customerData[i].companyName} test${i}`
        );
      }
      if (customerData[i].status !== companyData[i].linkedStatus) {
        amend(
          "companies",
          companyData[i].id,
          "linkedStatus",
          customerData[i].status
        );
      }
    }
  }, [customerData, companyData]);

  // Select customer ID.  Radio button handler function
  function selectId(id) {
    customerIdRef.current = id
  }

  // Delete function to remove customer record from the database
  async function del() {
    try {
      if (!customerIdRef.current) {
        alert("Please select a customer to delete.");
        return;
      }
  
      const collects = ["customers", "companies"];
      const batch = writeBatch(db); // Initialize batch once.
  
      for (const collect of collects) {
        if (collect === "customers") {
          const docRef = doc(db, "customers", customerIdRef.current);
          batch.delete(docRef);
        } else {
          const collRef = collection(db, collect);
          const companiesQuery = query(
            collRef,
            where("linkedCustomerId", "==", customerIdRef.current)
          );
          const querySnapshot = await getDocs(companiesQuery);
  
          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
        }
      }
  
      await batch.commit(); // Commit all batched operations at once.
      console.log("Customer and related documents deleted successfully.");
    } catch (err) {
      console.error(`Error deleting customer: ${err.message}`);
    } finally {
      customerIdRef.current = null; // Ensure this runs even if an error occurs.
    }
  }

  // Function to add new customer record to the database.  Ready for the user to add the data
  async function add() {
    try {
      const newCustomer = {
        companyName: null,
        tradingName: null,
        contactName: null,
        telNumber: null,
        email: null,
        merchantId: null,
        bankNumber: null,
        status: "pending",
        created: Date.now(),
      };
  
      const docRef = await addDoc(customers, newCustomer);
      const customerId = docRef.id;
  
      const newCompany = {
        linkedCustomerId: customerId,
        linkedCustomerCreated: newCustomer.created,
        linkedStatus: newCustomer.status,
        name: null,
        category: null,
        number: null,
        user: null,
        address: null,
      };
  
      await addDoc(companies, newCompany);
      console.log("Customer and linked company added successfully.");
    } catch (err) {
      console.error(`Error adding customer: ${err.message}`);
    }
  }
  
  // Function to amend existing customer data.
  async function amend(collect, id, field, value) {
    try {
      if (!collect || !id || !field) {
        throw new Error("Invalid input: Collection, ID, and field are required.");
      }
  
      const docRef = doc(db, collect, id);
      await setDoc(docRef, { [field]: value }, { merge: true });
      console.log(`Field "${field}" updated successfully in collection "${collect}".`);
    } catch (err) {
      console.error(`Error updating document: ${err.message}`);
    }
  }

  // Function to debounce the field update
  const debounceUpdate = (collect, id, field, value) => {

    if (debounceTimeoutsRef.current[id]) {
      clearTimeout(debounceTimeoutsRef.current[id]); //cancels previously set timeout with the same id
    }

    // Set a new timeout for Firestore update
    debounceTimeoutsRef.current[id] = setTimeout(() => {
      amend(collect, id, field, value); // Update Firestore
    }, 500); // 500ms debounce time
  };

  // Function to handle input changes and store them in tempText
  const handleUpdate = (collect, id, field, value) => {
    setTempText((prev) => ({
      ...prev,
      [id]: {
        ...prev[id], // Initialize `id` if it doesn't exist
        [field]: value,
      },
    }));

    // Debounce the actual update to Firestore
    debounceUpdate(collect, id, field, value);
  };

  // Paste handler function (for handling pasted text)
  const handlePaste = (collect, id, field, event) => {
    event.preventDefault(); // Prevent default paste behavior

    // Safely get the pasted value
    const pastedValue =
      (event.clipboardData && event.clipboardData.getData("text")) || "";

    // Update the input with the pasted value and trigger debouncing logic
    handleUpdate(collect, id, field, pastedValue);
  };

  // Map object containing possible statuses and their corresponding css classes
  const rowColourMap = {
    Declined: "row-declined",
    Live: "row-live",
    Application: "row-application",
    Prospect: "row-prospect"
  };

  // Function to determine the colouring of table rows based on customer status
  function rowColour(status) {
    return rowColourMap[status]
  };

  // Create a dictionary object that contains all of our components
  const componentMap = {
    Companies: (
      <Companies
        companyData={filteredCompanyData}
        handleUpdate={handleUpdate}
        handlePaste={handlePaste}
        tempText={tempText}
        rowColour={rowColour}
      />
    ),
    Contact: <Contact />,
    Locations: <Locations />,
    Deals: (
      <CustomerTable
        customerData={filteredCustomerData}
        selectId={selectId}
        handleUpdate={handleUpdate}
        handlePaste={handlePaste}
        rowColour={rowColour}
        customerId={customerIdRef}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        tempText={tempText}
        amend={amend}
        page={page}
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

  return (
    <div>
      <Header setPage={setPage} page={page} />
      <TableHeader filterStatus={filterStatus} add={add} deleteDoc={del} page={page} />
      {renderPage(page)}
    </div>
  );
}

export default App;
