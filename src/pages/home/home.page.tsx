import { CounterDisplay } from "@/components/counter/counter"
import { Store } from "@/lib/store/store"



export default function HomePage() {
  const counterStore = new Store<number>([0]);

  const increment = () => {
    const [n] = counterStore.get()
    counterStore.set([n + 1])
  }

  return (
    <div>
      <h1>HomePage</h1>
      <CounterDisplay store={counterStore} />
      <button onClick={increment}>Increment</button>
    </div>
  )
}
