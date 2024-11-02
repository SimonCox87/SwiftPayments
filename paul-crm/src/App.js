// import of the following code from react and firestore modules.  CustomerTable is our table component
// which has it's own script.
import React from "react";
import Header from "./components/Header"
import CustomerTable from "./components/CustomerTable";
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { customerCollection, db } from "./firebase";

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

  // Load data from firebase and close when session is over
  React.useEffect(() => {
    const unsubscribe = onSnapshot(customerCollection, function (snapshot) {
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
      alert("Please select a valid customer to delete.");
      return;
    }
    // Attempt to create document reference
    const docRef = doc(db, "customers", customerId);  
    // Attempt deletion
    await deleteDoc(docRef);
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
    await addDoc(customerCollection, newCustomer);
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

  // function that handles the filtering of the customer data by status.
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

  // function to colour rows by status.  result of each conditional (if) statement is the relevant css class.
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

  // Below elements are returned by app function.
  // 1. The Header component is returned and its props are defined and passed to the component.
  // 2. The CustomerTable component is returned and its props are defined and passed to the component.
  return (
    <div>
      <Header 
        filterStatus={filterStatus}
        add={add}
        deleteDoc={del}
      />
      < CustomerTable 
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
    </div>
  );
}

export default App;
