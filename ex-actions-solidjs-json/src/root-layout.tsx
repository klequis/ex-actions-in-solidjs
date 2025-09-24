import { Suspense } from 'solid-js'
import Nav from './components/nav'

export default function RootLayout(props) {
  console.log('RootLayout props:', props);
  return (
    <main class="component root-layout">
      <div class="filename-lg">
        root-layout.jsx
      </div>
      <Nav />
      <Suspense>{props.children}</Suspense>
    </main>
  )
}
