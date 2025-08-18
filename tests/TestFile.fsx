#r "nuget: Fable.Core"
#r "nuget: Feliz"

open Fable.Core
open Feliz

[<ReactComponent>]
let AnotherComponent(props: {|text1: string; number2: int|}) =
  JSX.jsx $"""
    <div>
      <h1>Another Component</h1>
      <p>This is another component. {props.text1} {props.number2}</p>
    </div>
  """


[<ReactComponent>]
let TestComponent() =
  let counter, setCounter = React.useState(0)
  let increase = fun () -> setCounter (counter + 1)
  JSX.jsx $"""
    <div>
      <button title="Test" onClick={increase}></button>
      <h1>Counter: {counter}</h1>
      <p>This is a test component.</p>
      <AnotherComponent text1="Hello from TestComponent" number2={counter} />
    </div>
  """