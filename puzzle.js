// Kích thước của bảng
const n = 3;
const m = 3;

// Khởi tạo một số trạng thái bắt đầu có thể giải được
const startpos = [
  [
    [4, 6, 1],
    [7, 2, 8],
    [3, 5, 0],
  ],
  [
    [6, 7, 0],
    [5, 8, 4],
    [1, 3, 2],
  ],
  [
    [6, 1, 4],
    [5, 0, 3],
    [8, 2, 7],
  ],
  [
    [4, 7, 3],
    [1, 6, 2],
    [5, 0, 8],
  ],
  [
    [2, 5, 4],
    [6, 3, 8],
    [7, 1, 0],
  ],
  [
    [7, 1, 3],
    [4, 2, 6],
    [0, 8, 5],
  ],
  [
    [2, 8, 7],
    [4, 5, 3],
    [6, 1, 0],
  ],
  [
    [2, 4, 3],
    [8, 7, 0],
    [1, 6, 5],
  ],
  [
    [6, 8, 4],
    [3, 7, 1],
    [5, 2, 0],
  ],
  [
    [3, 8, 4],
    [5, 6, 1],
    [2, 7, 0],
  ],
];
// Trạng thái cuối cùng
const goal = [
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 0],
  ],
  [
    [7, 8, 0],
    [4, 5, 6],
    [3, 2, 1],
  ],
  [
    [2, 3, 8],
    [7, 0, 1],
    [6, 5, 4],
  ],
  [
    [2, 4, 6],
    [7, 0, 8],
    [1, 3, 5],
  ],
];

// Hàm để đẩy một trạng thái mới và độ ưu tiên của nó vào open và sắp xếp danh sách dựa trên độ ưu tiên f
function PushNSort(open, f, q, new_board) {
  //JSON.stringify và JSON.parse là hai hàm JavaScript cung cấp để chuyển đổi đối tượng JavaScript thành chuỗi JSON và ngược lại (array => JSON).
  open.push([[f, q], JSON.parse(JSON.stringify(new_board))]);
  open.sort((a, b) => {
    return b[0][0] - a[0][0];
  });
}

// Hàm để tính kc Manhattan giữa bảng hiện tại và trạng thái cuối cùng
function manhattan(board, final) {
  let d = 0;
  for (let i = 0; i < n; ++i) {
    for (let j = 0; j < m; ++j) {
      if (board[i][j] !== final[i][j] && board[i][j] !== 0) {
        let x = Math.floor((board[i][j] - 1) / m);
        let y = (board[i][j] - 1) % m;
        d += Math.abs(x - i) + Math.abs(y - j);
      }
    }
  }
  return d;
}

// Hàm để tìm vị trí của số 0 (ô trống) trong bảng
function PositionZero(board) {
  let p = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (board[i][j] === 0) {
        p = [i, j];
        break;
      }
    }
  }
  return p;
}

// Hàm giải thuật tìm cách giải puzzle dựa trên thuật toán a*
function slidingPuzzle(start, final, path) {
  let open = [];
  let close = [];
  let parent = new Map();

  open.push([[manhattan(start, final), 0], JSON.parse(JSON.stringify(start))]);

  let flag = false;
  let numberStep = 0;
  // Theo thứ tự
  let dx = [0, 0, 1, -1];
  let dy = [1, -1, 0, 0];

  while (open.length > 0) {
    //Lấy ra trạng thái có khoảng cách Manhattan nhỏ nhất từ open và kiểm tra xem nó có
    //phải là trạng thái cuối cùng không. Nếu đúng, hàm sẽ trả về số bước di chuyển cần thiết để đạt được trạng thái cuối
    let T = open.pop();
    let t = T[1];
    if (JSON.stringify(t) === JSON.stringify(final)) {
      numberStep = T[0][1];
      flag = true;
      break;
    }
    // Kiểm tra nếu trạng thái đã nằm trong close. Nếu rồi thì quay trở lại đầu vòng lặp. Chưa thì thêm trạng thái vào close
    if (close.includes(JSON.stringify(t))) {
      continue;
    }
    close.push(JSON.stringify(t));

    // Lấy vị trị của 0 tại trạng thái hiện tại
    let pos = PositionZero(t);

    // Duyệt qua tất cả các bước có thể
    for (let i = 0; i < 4; i++) {
      let x_new = pos[0] + dx[i];
      let y_new = pos[1] + dy[i];
      let new_board = JSON.parse(JSON.stringify(t));
      // Kiểm tra nếu bước hợp lệ, thì swap 2  vị trí 0 và bước mới vào new_board
      if (x_new >= 0 && x_new < n && y_new >= 0 && y_new < m) {
        [new_board[pos[0]][pos[1]], new_board[x_new][y_new]] = [
          new_board[x_new][y_new],
          new_board[pos[0]][pos[1]],
        ];
        // Tính kc manhattan. Nếu trạng thái mới chưa có trong close thì thêm vào open và set parent của trạng thái mới là trạng thái cũ
        let manhattanDistance = manhattan(new_board, final);
        if (!close.includes(JSON.stringify(new_board))) {
          PushNSort(open, T[0][1] + manhattanDistance, T[0][1] + 1, new_board);
          parent.set(JSON.stringify(new_board), JSON.stringify(t));
        }
      }
    }
  }
  if (flag) {
    let i = 0;
    let curr = JSON.stringify(final);

    // Vòng lặp truy ngược lại đường đi bằng parent
    while (i < numberStep) {
      path.push(curr);
      curr = parent.get(curr);
      i++;
    }
    path.reverse();

    console.log("Path length: " + numberStep);
    console.log("start: ", JSON.stringify(start));
    console.log("finish: ", JSON.stringify(final));
    console.log("step by step: ", path);
  } else {
    alert("Dont have");
  }
}

let path = [];
let start = [];
let final = [];
/*Hàm bao gồm tạo giao diện hai bảng cho trạng thái bắt đầu start và trạng thái goal.
 Trạng thái bắt đầu được tạo ngẫu nhiên từ mảng startpos cho trước*/
function OnCreate() {
  path = [];

  document.getElementById("board3").innerHTML = "";
  document.getElementById("b3").innerHTML = "";
  start = startpos[Math.floor(Math.random() * startpos.length)];
  final = goal[Math.floor(Math.random() * goal.length)];

  //Phần tạo giao diện
  const boardContainer = document.getElementById("board");
  const boardContainer2 = document.getElementById("board2");
  const b1 = document.getElementById("b1");
  const b2 = document.getElementById("b2");
  boardContainer.style.gridTemplateColumns = `repeat(${m}, 1fr)`;
  boardContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  boardContainer2.style.gridTemplateColumns = `repeat(${m}, 1fr)`;
  boardContainer2.style.gridTemplateRows = `repeat(${n}, 1fr)`;

  // Hai vòng lặp tạo bảng start và goal. Ô 0 màu khác các ô còn lại
  const html = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const cellContent = `<div id="box_${i}_${j}" class="${
        start[i][j] === 0 ? "checkboard_white" : "checkboard_black"
      }"> ${start[i][j]}</div>`;
      html.push(cellContent);
    }
  }
  b1.innerHTML = "Start";
  boardContainer.innerHTML = html.join("");

  const html2 = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const cellContent2 = `<div id="box_${i}_${j}" class="${
        final[i][j] === 0 ? "checkboard_white" : "checkboard_black"
      }"> ${final[i][j]}</div>`;
      html2.push(cellContent2);
    }
  }
  b2.innerHTML = "Goal";
  boardContainer2.innerHTML = html2.join("");
}

// Hàm được gọi khi có sự kiện nhấn "Solve". Gọi hàm `slidingPuzzle` để tìm cách giải. Sau đó tạo giao diện
function SubmitFunc() {
  let index = 0;
  slidingPuzzle(start, final, path); //Giải
  //Tạo giao diện Solve
  const boardContainer = document.getElementById("board3");
  const b3 = document.getElementById("b3");
  boardContainer.style.gridTemplateColumns = `repeat(${m}, 1fr)`;
  boardContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;
  document.getElementById("find").setAttribute("disabled", "disabled");

  // Hàm renderNumber hiển thị các bước đường đi và animation, set timeout ở mỗi bước
  function renderNumber(index) {
    b3.innerHTML = "Solve";
    if (index >= 0 && index < path.length) {
      let cur = JSON.parse(path[index]);
      const html = [];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
          const cellContent = `<div id="box_${i}_${j}" class="${
            cur[i][j] === 0 ? "checkboard_white" : "checkboard_black"
          }"> ${cur[i][j]}</div>`;
          html.push(cellContent);
        }
      }
      setTimeout(
        () => {
          boardContainer.innerHTML = html.join("");
          renderNumber(index + 1);
        },
        index === 0 ? 0 : 1500
      );
    }
    setTimeout(() => {
      document.getElementById("find").removeAttribute("disabled");
    }, path.length * 1000);
  }

  renderNumber(0);
}
