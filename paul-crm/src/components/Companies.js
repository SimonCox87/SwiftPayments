import React from "react";

function Companies({
  companyData,
  handleUpdate,
  handlePaste,
  tempText,
  rowColour,
}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Number</th>
          <th>User</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {companyData.map((company, index) => (
          <tr key={index} className={rowColour(company.linkedStatus)}>
            <td>
              <input
                type="text"
                value={
                  (tempText[company.id] && tempText[company.id].name) ||
                  company.name
                }
                onChange={(e) =>
                  handleUpdate("companies", company.id, "name", e.target.value)
                }
                onPaste={(e) => handlePaste("companies", company.id, "name", e)}
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[company.id] && tempText[company.id].category) ||
                  company.category
                }
                onChange={(e) =>
                  handleUpdate(
                    "companies",
                    company.id,
                    "category",
                    e.target.value
                  )
                }
                onPaste={(e) =>
                  handlePaste("companies", company.category, "category", e)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[company.id] && tempText[company.id].number) ||
                  company.number
                }
                onChange={(e) =>
                  handleUpdate(
                    "companies",
                    company.id,
                    "number",
                    e.target.value
                  )
                }
                onPaste={(e) =>
                  handlePaste("companies", company.number, "number", e)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[company.id] && tempText[company.id].user) ||
                  company.user
                }
                onChange={(e) =>
                  handleUpdate("companies", company.id, "user", e.target.value)
                }
                onPaste={(e) =>
                  handlePaste("companies", company.user, "user", e)
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={
                  (tempText[company.id] && tempText[company.id].address) ||
                  company.address
                }
                onChange={(e) =>
                  handleUpdate(
                    "companies",
                    company.id,
                    "address",
                    e.target.value
                  )
                }
                onPaste={(e) =>
                  handlePaste("companies", company.address, "adress", e)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Companies;
