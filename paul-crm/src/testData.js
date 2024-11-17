const testData = [
    {
        companyName: "Sainsbury's",
        tradingName: "Sainsbury's plc",
        contactName: "Steve Smith",
        telephoneNumber: "000000000",
        email: "sainsburys@sainsburys.co.uk",
        merchantId: "00000",
        bankAccountNumber: "00000",
        status: "live"
    },
    {
        companyName: "Tesco",
        tradingName: "Tesco plc",
        contactName: "Sarah Smith", 
        telephoneNumber: "111111111",
        email: "tesco@tesco.co.uk",
        merchantId: "11111",
        bankAccountNumber: "11111",
        status: "application"  
    },
    {
        companyName: "Waitrose",
        tradingName: "Waitrose Partnership",
        contactName: "Jim Smith",
        telephoneNumber: "222222222",
        email: "waitrose@waitrose.co.uk",
        merchantId: "22222",
        bankAccountNumber: "22222",
        status: "declined"  
    },
    {
        companyName: "Marks and Spencers",
        tradingName: "M&S LTD",
        contactName: "Sue Smith",
        telephoneNumber: "333333333",
        email: "m&s@m&s.co.uk",
        merchantId: "33333",
        bankAccountNumber: "33333",
        status: "prospect"  
    },
    {
        companyName: "Lidl",
        tradingName: "Lidl plc",
        contactName: "Tom Smith",
        telephoneNumber: "444444444",
        email: "lidl@lidl.co.uk",
        merchantId: "44444",
        bankAccountNumber: "44444",
        status: "application"  
    }, 

]

const companyTestData = [
    {
        name: "Sainsbury's test0",
        category: "test0",
        number: "test0",
        user: "test0",
        address: "test0",
        linkedStatus: "pending"
    },
    {
        name: "Tesco test1",
        category: "test0",
        number: "test0",
        user: "test0",
        address: "test0",
        linkedStatus: "pending"
    },
    {
        name: "Waitrose test2",
        category: "test0",
        number: "test0",
        user: "test0",
        address: "test0",
        linkedStatus: "pending"
    },
    {
        name: "Marks and Spencers test3",
        category: "test0",
        number: "test0",
        user: "test0",
        address: "test0",
        linkedStatus: "pending"
    },
    {
        name: "Lidl test4",
        category: "test0",
        number: "test0",
        user: "test0",
        address: "test0",
        linkedStatus: "pending"
    },
]


// const newCompanyTestData = companyTestData.map((company,i) => {
//     return {...company, linkedStatus: testData[i].status};
// })

// console.log(newCompanyTestData)

const collections = [companyTestData];


for (let i = 0; i < companyTestData.length; i++) {
   if (companyTestData[i].linkedStatus !== testData[i].status) {
    companyTestData[i].linkedStatus = testData[i].status
   }
}

console.log(companyTestData)

