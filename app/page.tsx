'use client';
import Image from 'next/image'
import Select from './components/select'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { AnalyticsBrowser } from '@segment/analytics-next';

const coffeeShopItems = [
  { id: 1, description: 'Espresso', target_measurement: 30, delta: 5 },
  { id: 2, description: 'Double Espresso', target_measurement: 60, delta: 8 },
  { id: 3, description: 'Latte Macchiato', target_measurement: 230, delta: 10 },
  { id: 4, description: 'Cappuccino', target_measurement: 150, delta: 10 }
];

const coffeeShopIngredients = [
  { id: 1, description: 'Espresso Beans' },
  { id: 2, description: 'Milk' },
  { id: 3, description: 'Decaf Espresso Beans' },
  { id: 4, description: 'Soy Milk' },
  { id: 5, description: 'Sugar' },
  { id: 6, description: 'Cream' }
];

const booths = [
  { id: 1, description: 'Materialize Booth'},
  { id: 2, description: 'Hallway Booth'},
  { id: 3, description: 'Keynote Booth'}
]

export default function Home() {
  // This sensor is always the same one.
  const [sensor, ] = useState(1);
  const ref = useRef<AnalyticsBrowser | null>(null);
  const [item, setItem] = useState(coffeeShopItems[0]);
  const [ingredient, setIngredient] = useState(coffeeShopIngredients[0]);
  const [booth, setBooth] = useState(booths[0]);
  const [amount, setAmount] = useState(0);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (ref.current === null) {
      const analytics = AnalyticsBrowser.load({ writeKey: '1TjwHjUXtOjQ3pdQBG35htHMbFaYDisL' });
      analytics.identify({
        subscriptionStatus: 'inactive'
      });
      ref.current = analytics;
    }
  }, [ref]);

  const [sliderValue, setSliderValue] = useState(item.target_measurement);

  const min = 0;
  const max = 300;

  const sensorChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(e.target.value));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetch("/api", {
        method: "POST",
        body: JSON.stringify({
          type: "sensor",
          target: e.target.value,
          sensor_id: sensor,
        }),
      });
    }, 300);  // 300ms delay
  }, [sensor]);

  const manufacturingChange = useCallback((item: { id: number, description: string }) => {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        type: "manufacturing",
        item,
      }),
    });
  }, []);

  const onResupplyClick = useCallback(() => {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        type: "resupply",
        booth,
        ingredient,
        amount,
      }),
    });
  }, [booth, amount, ingredient]);

  const onItemChange = useCallback((value: any) => {
    setItem(value);
    manufacturingChange(value);
    setSliderValue(value.target_measurement);
  }, [manufacturingChange]);

  const onIngredientChange = useCallback((value: any) => {
    setIngredient(value);
  }, []);

  const onBoothChange = useCallback((value: any) => {
    setBooth(value);
  }, []);

  useEffect(() => {
    // Set the correct manufacturing only once.
    manufacturingChange(item);

    return () => {
      if (debounceTimer.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(debounceTimer.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-center">
          <h1 className='text-4xl'>Operational coffee shop</h1>
          {/* Materialize Booth */}
      </div>

      <div>
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"/>

        <Select onChange={onItemChange} value={item} label="Sensor" options={coffeeShopItems} />
        <div className="flex flex-col space-y-2 p-2 w-80">
          <input value={sliderValue} min={min} max={max} type="range" className='mt-4 w-full rounded-lg bg-gray-100 appearance-none' onChange={sensorChange} />
          <ul className="flex justify-between w-full px-[10px]">
              <li className="flex justify-center relative"><span className="absolute">{min}</span></li>
              <li className="flex justify-center relative"><span className="absolute">150</span></li>
              <li className="flex justify-center relative"><span className="absolute">{max}</span></li>
          </ul>
      </div>

        <div className='mt-10'>
          <Select label="Booth" options={booths} onChange={onBoothChange} value={booth} />
        </div>

        <div className='mt-2'>
          <Select label="Ingredient" options={coffeeShopIngredients} onChange={onIngredientChange} value={ingredient} />
          <div className='mt-2'>
            <label htmlFor="amount" className="block text-sm text-gray-200 font-medium leading-6 ">
              Amount
            </label>
            <div className="mt-2 flex flex-col">
              <input
                type="text"
                name="amount"
                id="amount"
                pattern="^-?\d+(\.\d+)?$"
                // min={1}
                value={amount}
                className="block w-full rounded-md border-0 px-0.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="100"
                onChange={(e) => { if (Number.isSafeInteger(Number(e.target.value))) { setAmount(Number(e.target.value)) } }}
              />
              <button
                type="button"
                className="mt-2 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={onResupplyClick}
              >
                Resupply
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/materialize.svg"
              alt="Materialize Logo"
              width={120}
              height={48}
              priority
            />
          </a>
        </div>
    </main>
  )
}
