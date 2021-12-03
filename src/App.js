import {
  useQuery,
  useMutation,
  gql,
  useSubscription
} from "@apollo/client";
import './App.css';
import { useState } from "react";


const BOOKS_QUERY = gql`
          query books($first: Int, $after: String, $last: Int, $before: String){
              books(first: $first, after: $after, last: $last, before: $before){
                  pageInfo{
                    startCursor
                    endCursor
                  }
              edges{
                  node{
                      name
                      id
                      genre
                  }
                  cursor
                }
              }
      }
 `;

const AUTHOR_MUTATION = gql`
  mutation demo($name: String, $age: Int) {
  author(name: $name, age: $age){
    name,id,age
  }
}
 
 `;

const GET_AUTHOR = gql`
  query getAuthor($id: Int){
    author(id: $id){
      id,
      name,
      age
    }
  }
 `;

const AUTHOR_SUBSCRIPTION = gql`
  subscription newAuthor($id: Int){
    newAuthor(id: $id){
      name,
      age,
      id
    }
      
  }
`;

const GET_AUTHORS = gql`
  query allAuthors{
    authors{
      name,
      id,
      age
    }
  }
`;

function AuthorMutation() {
  const [state, setstate] = useState({ name: '', age: -1 })
  const [mutateAuthor, { loading, error, data }] = useMutation(AUTHOR_MUTATION, {
    update: (cache, { data: { author } }) => {
      const data = cache.readQuery({ query: GET_AUTHORS });
      console.log("Mutation: " + author);
      cache.writeQuery({ query: GET_AUTHORS, data: { authors: [author, ...data.authors] } });
    }
  });
  if (loading) return <p> Loading... </p>;
  if (error) return <p> Error :(</p>;

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          console.log(state);
          mutateAuthor({
            variables: { name: state.name, age: parseInt(state.age) }, onCompleted: (data) => {
              console.log(data);
            }
          })


        }}
      >
        <input type="textbox" value={state.name} onChange={(e) => setstate({ ...state, name: e.target.value })} name="authorName" /> <br />
        <input type="number" value={state.age} onChange={(e) => setstate({ ...state, age: e.target.value })} name="authorAge" /> <br />

        <button type="submit">Add Todo</button>
      </form>
    </div>
  );

}

function SubscriptionApp() {
  const { data, loading } = useSubscription(AUTHOR_SUBSCRIPTION, {
    variables: {
      id: 17
    }
  });
  if (loading) return "Loading subscription"
  console.log(data);
  return <h4>New Author: {data.newAuthor.name}</h4>;
}

function paginatedView() {

}

function App() {
  const [after, setAfter] = useState("");

  const { loading, error, data, fetchMore } = useQuery(BOOKS_QUERY, {
    variables: {
      first: 2,
      after: after
    }
  });


  if (loading) return <p> Loading... </p>;
  if (error) return <p> Error :(</p>;
    const pageInfo = data.books.pageInfo;
  

    console.log(data);
  return (
    <div className="App">
      <header className="App-header">
        <h1> Apollo graphql testing with apollo client</h1>
        <ul>
          {
            
            data.books.edges.map((edge) => {
              return <li key={edge.node.id}> {edge.node.genre} {edge.node.name}</li>
            })
          }
        </ul>

        <button onClick={() => {
          
          fetchMore({ variables: {
            first: 2,
            after: pageInfo.endCursor
          }}).then(() => {
            setAfter(pageInfo.endCursor);
          });
        }
        }> Button </button>


      </header>

    </div>
  );
}

export default App;

/*
   <ul>
          {
            data.authors.map((author) => {
              return <li key={author.id}> {author.name} {author.age}</li>
            })
          }
        </ul>
*/
