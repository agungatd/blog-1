const dateHelper = (data) => {
    data = JSON.stringify(data)
    data = JSON.parse(data)
    for (let i = 0; i < data.length; i++) {
        data[i].date = {
            date: new Date(data[i].createdAt).getDate(),
            month: new Date(data[i].createdAt).getMonth(),
            year: new Date(data[i].createdAt).getFullYear()
        }
    }
    return data
}

module.exports = dateHelper