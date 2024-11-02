import React from "react";

// Function that renders the CustomerTable Component.
// The parameters of the CustomerTable are the props for the component handed down from App.js
function CustomerTable({
  customerData,
  selectId,
  handleUpdate,
  rowColour,
  customerId,
  handleFilter,
  tempText,
  amend,
}) {

  // Table is returned by this function.
  // Create the table headers  
  // We loop through customerData (derived from filteredCustomerData) to populate table rows
  // Each cell of the table contains data and a function that triggers when data is amended.
  // Also styling is applied to table rows to determine colouring based on status.

  return (
    <table>
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Trading Name</th>
          <th>Contact Name</th>
          <th>Telephone Number</th>
          <th>Email</th>
          <th>Merchant ID (MID)</th>
          <th>Bank Account Number</th>
          <th>
            Status
            <select
              id="statusFilter"
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Live">Live</option>
              <option value="Application">Application</option>
              <option value="Declined">Declined</option>
              <option value="Prospect">Prospect</option>
            </select>
          </th>
          <th>Selected</th>
        </tr>
      </thead>
      <tbody>
        {customerData.map((customer, index) => (
          <tr
            key={index}
            className={rowColour(customer.status)}
            style={{
              backgroundColor:
                customer.id === customerId && "RGB(200, 162, 200)",
            }}
          >
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] &&
                    tempText[customer.id].companyName) ||
                  customer.companyName
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "companyName", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] &&
                    tempText[customer.id].tradingName) ||
                  customer.tradingName
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "tradingName", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] &&
                    tempText[customer.id].contactName) ||
                  customer.contactName
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "contactName", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] && tempText[customer.id].telNumber) ||
                  customer.telNumber
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "telNumber", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] && tempText[customer.id].email) ||
                  customer.email
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "email", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] && tempText[customer.id].merchantId) ||
                  customer.merchantId
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "merchantId", e.target.value)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[customer.id] && tempText[customer.id].bankNumber) ||
                  customer.bankNumber
                }
                onChange={(e) =>
                  handleUpdate(customer.id, "bankNumber", e.target.value)
                }
              />
            </td>
            <td>
              <select
                id="status"
                name="status"
                value={
                  (tempText[customer.id] && tempText[customer.id].status) ||
                  customer.status
                }
                onChange={(e) => amend(customer.id, "status", e.target.value)}
              >
                <option value="Live">Live</option>
                <option value="Application">Application</option>
                <option value="Declined">Declined</option>
                <option value="Prospect">Prospect</option>
              </select>
            </td>
            <td>
              <input
                type="radio"
                name="customer"
                onClick={() => selectId(customer.id)}
              ></input>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CustomerTable;
