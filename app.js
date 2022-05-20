const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

/** ソートアルゴリズム一覧 */
const algorithms = [
  { code: "bubble", name: "バブルソート" },
  { code: "selection", name: "選択法" },
  { code: "insertion", name: "挿入法" },
  { code: "merge", name: "マージソート" },
  { code: "quick", name: "クイックソート" },
];
/** デフォルト入力値 */
const defaultInputNumbers = [0, 0, 0, 0, 0];

// 初期表示画面
app.get("/", (req, res) => {
  // デフォルトでランダムな値を設定する
  for (let i = 0; i < defaultInputNumbers.length; i++) {
    // 100までの整数を生成
    defaultInputNumbers[i] = Math.floor(Math.random() * 100);
  }
  // 初期データで画面を表示
  res.render("index.ejs", {
    algorithms: algorithms,
    inputNumbers: defaultInputNumbers,
    result: "数値を入力し、ソートボタンを押下してください",
    selectedAlgorithm: "bubble",
  });
});

// ソート結果画面
app.post("/", (req, res) => {
  // 入力した数値は文字列で渡ってくるため、数値型に変換
  const inputNumbers = req.body.inputNumbers.map((value) => Number(value));
  const alg = req.body.algorithm;
  let result;
  try {
    console.log("start sort. algorithm:", alg, " input:", inputNumbers);
    const start = new Date().getTime();

    // 選んだソートアルゴリズムを読み込み
    const sort = require("./sort_algorithms/" + alg);
    if (sort) {
      // ソート処理を実行
      const sorted = sort(inputNumbers);
      // 並び替えた結果をカンマ区切りの文字列に変換
      result = sorted.join(",");

      const end = new Date().getTime();
      console.log("sort end. result", sorted, " time:", end - start, "ミリ秒");
    } else {
      // ソート結果がない場合(基本的にあり得ない)
      throw new Error("ソートアルゴリズムの結果が異常です");
    }
  } catch (err) {
    console.log(err);
    result = "エラーが発生しました";
  }

  // 結果をHTMLに組み込んで返却
  res.render("index.ejs", {
    algorithms: algorithms,
    inputNumbers: inputNumbers,
    result: result,
    selectedAlgorithm: alg,
  });
});

app.listen(3000);
console.log("listen: http://localhost:3000");
