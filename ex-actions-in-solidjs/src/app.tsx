import { Suspense, type Component } from 'solid-js';
import Nav from './nav';

const App: Component<{ children: Element }> = (props) => {
  return (
    <>
      <main>
        <h2>ex-actions-in-solidjs</h2>
        <Nav />
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;