"use client";
import { useFormState, useFormStatus } from "react-dom";
import { getSkuData } from "@/app/actions";

const initialState = {
  message:'',
  product: {available_tags:'b',
						template: 'demo',
						meta_data:{}} 
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="border p-4" type="submit" aria-disabled={pending}>
      Generate
    </button>
  );
}

export default function Home() {
 
	const [state, formAction] = useFormState(getSkuData, initialState)

	let product_template = '/templates/' + state?.product.template + '_template.html';



  return (
		<>
			<main className="flex min-h-screen flex-col items-center p-24">
				<form action={formAction}>
					<label htmlFor="sku">Enter SKU</label>
					<input type="text" id="sku" name="sku" className="border p-2 bg-black" required />
					<SubmitButton />
					<p aria-live="polite" role="status">
						{state?.message} 
					</p>
				</form>
				
				<aside className="fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto">
					{Object.entries(state?.product).map(([key, value]) => (
							<div key={key}>
								<span>&#123;&#123;{key}&#125;&#125;</span>
							</div>
					))}
					{Object.entries(state?.product.meta_data).map(([key, value]) => (
							<div key={key}>
								<span>&#123;&#123;{key}&#125;&#125;</span>
							</div>
					))}
				</aside>
				<iframe className="w-full h-dvh" src={product_template}></iframe>
			</main>
				</>

		);
}
