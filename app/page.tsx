"use client";

import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";

import { getSkuData } from "@/app/actions";

const initialState = {
  message: "",
  product: {available_tags:'b'} 
};


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="border p-4" type="submit" aria-disabled={pending}>
      Get SKU
    </button>
  );
}


export default function Home() {
 
  const [state, formAction] = useFormState(getSkuData, initialState)

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
	<h1>
	  AdCreator
	</h1>
        <form action={formAction}>
		<label htmlFor="sku">Enter SKU</label>
		<input type="text" id="sku" name="sku" className="border p-2 bg-black" required />
		<p>Use template:[TEMPLATE]</p>
		<SubmitButton />
		<p aria-live="polite" role="status">
			{state?.message} 
		</p>
	</form>
	<aside className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto">
	<div className="p-10">
	{Object.entries(state?.product).map(([key, value]) => (
    	<tr key={key}>
        <td>&#123;&#123;{key}&#125;&#125;</td>
    	</tr>
	))}
	</div>
	</aside>	
    </main>
  );
}
