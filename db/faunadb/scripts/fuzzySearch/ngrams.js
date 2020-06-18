const faunadb = require("faunadb");
const q = faunadb.query;
const {
  CreateIndex,
  Collection,
  Exists,
  If,
  Index,
  Delete,
  Lambda,
  Var,
  Query,
  Length,
  Select,
  Subtract,
  Let,
  NGram,
  LowerCase,
  Filter,
  GT,
  Union,
  Distinct,
  Paginate,
  Match,
  Map,
  Get,
} = q;

function GenerateNgrams(Phrase) {
  return Distinct(
    Union(
      Let(
        {
          // Reduce this array if you want less ngrams per word.
          indexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          indexesFiltered: Filter(
            Var("indexes"),
            // filter out the ones below 0
            Lambda("l", GT(Var("l"), 0))
          ),
          ngramsArray: q.Map(
            Var("indexesFiltered"),
            Lambda("l", NGram(LowerCase(Var("Phrase")), Var("l"), Var("l")))
          ),
        },
        Var("ngramsArray")
      )
    )
  );
}

function GenerateWordParts(inputWord) {
  return Distinct(
    Let(
      {
        indexes: q.Map(
          // Reduce this array if you want less ngrams per word.
          // Setting it to [ 0 ] would only create the word itself, Setting it to [0, 1] would result in the word itself
          // and all ngrams that are one character shorter, etc..
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          Lambda("eachIdx", Subtract(Length(inputWord), Var("eachIdx"))) // for 'smallerText' there might be negative vals generated, will cleanup in step2
        ),
        indexesFiltered: Filter(
          Var("indexes"),
          Lambda("eachIdx", GT(Var("eachIdx"), 0)) // cleanup: filter out negative indexes
        ),
        ngramsArray: q.Map(
          Var("indexesFiltered"),
          Lambda(
            "eachIdx",
            NGram(LowerCase(inputWord), Var("eachIdx"), Var("eachIdx"))
          )
        ),
      },
      Var("ngramsArray")
    )
  );
}

/*
Union(
  // We'll search both on the name as the 'username'.
  Union(GenerateWordParts(Select(["data", "name"], Var("user")))),
  Union(
    GenerateWordParts(Select(["data", "username"], Var("user")))
  )
)
*/

module.exports = {
  GenerateWordPartss,
};
