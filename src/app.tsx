import { Suspense, type Component } from 'solid-js';
import Nav from './nav';

const App: Component<{ children: Element }> = (props) => {
  return (
    <>
      <main>
        <Nav />
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;