let userData = [];
const tableBody = document.querySelector('#table_body');
const scoreHeader = document.querySelector('#score_column');
let scoreAscending = false;

const getUserRankingsAsync = async url => {
  // this is aync await syntax for fetching data.
  const response = await fetch(url);
  const userData = await response.json();

  return userData;
};

// const fetchData = (url) => {
//   return fetch(url).then(res => res.json()).then(res => res)
// }

// it will be passed inside filter function which is a higher order function
// and its an callback function.
const filterValues = item => item.score > 30;

const sortUserScores = () => {
  const tempData = [...userData];
  tempData.sort((a, b) =>
    scoreAscending ? a.score - b.score : b.score - a.score
  );
  const filteredData = tempData.filter(filterValues);
  const newData = tempData.map(item => ({
    name: item.name,
    score: item.score,
  }));
  scoreAscending = !scoreAscending;
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
  console.log(tempData, newData);
  renderTableRows(filteredData);
};

// Adding event handlers to an element
// scoreHeader.addEventListener('click', sortUserScores)

const renderTableRows = data => {
  data?.forEach((user, i) => {
    const tRow = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    td1.textContent = user.rank;
    td1.classList.add('p-3', `${i % 2 === 0 ? 'bg-white' : 'bg-sky-50'}`);
    td2.textContent = user.first_name;
    td2.classList.add('p-3', `${i % 2 === 0 ? 'bg-white' : 'bg-sky-50'}`);
    td3.textContent = user.country;
    td3.classList.add('p-3', `${i % 2 === 0 ? 'bg-white' : 'bg-sky-50'}`);
    td4.textContent = user.total_point;
    td4.classList.add('p-3', `${i % 2 === 0 ? 'bg-white' : 'bg-sky-50'}`);
    tRow.appendChild(td1);
    tRow.appendChild(td2);
    tRow.appendChild(td3);
    tRow.appendChild(td4);
    tableBody.appendChild(tRow);
  });
};

const main = async () => {
  userData = await getUserRankingsAsync('http://localhost:8000/api/users/rank');
  // fetchData(
  //   'https://64743e827de100807b1a84ab.mockapi.io/api/v1/leaderboard/users'
  // ).then(data => renderTableRows(data));
  renderTableRows(userData);
};
console.log(userData);

main();
