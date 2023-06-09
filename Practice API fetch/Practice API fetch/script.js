fetch('http://localhost:8000/api/users/rank')
  .then(data => {
    // console.log(data);
    return data.json(); //converted to object
  })
  .then(objectData => {
    // console.log(objectData[0].score);
    let tableData = '';
    objectData.map(values => {
      tableData += `
        <tr>
                <td>${values.first_name}</td>
                <td>${values.country}</td>
                <td><img src="${values.profile_picture}"/></td>
                <td>${values.total_point}</td>
                <td>${values.rank}</td>
        </tr>`;
    });
    document.getElementById('table_body').innerHTML = tableData;
  });
