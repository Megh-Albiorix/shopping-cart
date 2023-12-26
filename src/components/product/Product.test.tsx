import userEvent from "@testing-library/user-event";
import { act, render, screen } from "../../test-utils";
import ProductSection from "./ProductSection";
import * as apiServices from "../../services/apiServices";
import ProductItem from "./ProductItem";
import { commonMockResponse } from "../../mocks/handlers";
import MainApp from "../main-app/MainApp";
import { MemoryRouter } from "react-router-dom";

const { product, productId, quantity } = commonMockResponse.data;

const deleteCartQtyMock = jest.spyOn(apiServices, "deleteCartQty");
const postCartMock = jest.spyOn(apiServices, "postCart");
const setIsDisabledMock = jest.fn();

describe("Products Tests", () => {
	test("Testing that product section's 1st page is getting rendered successfully", async () => {
		let productsContainer;
		await act(async () => {
			const { container } = await render(<ProductSection />);
			productsContainer = container;
		});

		const productsHeadings =
			productsContainer!.querySelectorAll(".products__item");

		const productsImages = productsContainer!.querySelectorAll(
			".products__item-img"
		);
		const productsTitles = productsContainer!.querySelectorAll(
			".products__item-title"
		);
		const productsCategoryText =
			productsContainer!.querySelectorAll(".rating__text");
		const productsPrices = productsContainer!.querySelectorAll(
			".products__item-price"
		);
		const AddtoCartButtons = productsContainer!.querySelectorAll(
			".products__item-details-box button"
		);
		const paginationBtns = screen.getAllByRole("button", { name: /[1-9]/i });

		expect(productsHeadings).toHaveLength(8);
		expect(productsImages).toHaveLength(8);
		expect(productsTitles).toHaveLength(8);
		expect(productsCategoryText).toHaveLength(8);
		expect(productsPrices).toHaveLength(8);
		expect(AddtoCartButtons).toHaveLength(8);
		expect(paginationBtns).toHaveLength(2);
	});

	test("Render 2nd page of products pagination on click of button", async () => {
		let productsContainer;
		await act(async () => {
			const { container } = await render(<ProductSection />);
			productsContainer = container;
		});

		const secondPageBtn = screen.getByRole("button", { name: /2/i });

		await userEvent.click(secondPageBtn);

		const productsHeadings =
			productsContainer!.querySelectorAll(".products__item");

		const productsImages = productsContainer!.querySelectorAll(
			".products__item-img"
		);
		const productsTitles = productsContainer!.querySelectorAll(
			".products__item-title"
		);
		const productsCategoryText =
			productsContainer!.querySelectorAll(".rating__text");
		const productsPrices = productsContainer!.querySelectorAll(
			".products__item-price"
		);
		const AddtoCartButtons = productsContainer!.querySelectorAll(
			".products__item-details-box button"
		);
		const paginationBtns = screen.getAllByRole("button", { name: /[1-9]/i });

		expect(productsHeadings).toHaveLength(4);
		expect(productsImages).toHaveLength(4);
		expect(productsTitles).toHaveLength(4);
		expect(productsCategoryText).toHaveLength(4);
		expect(productsPrices).toHaveLength(4);
		expect(AddtoCartButtons).toHaveLength(4);
		expect(paginationBtns).toHaveLength(2);
	});
});

describe("Tests for Individual Product Item", () => {
	test("Adding Product Item to cart", async () => {
		let productsContainer;
		await act(async () => {
			const { container } = await render(<ProductSection />);
			productsContainer = container;
		});

		const AddtoCartButtons = productsContainer!.querySelectorAll(
			".products__item-details-box button"
		);
		for (let addtoCartBtn of AddtoCartButtons) {
			await userEvent.click(addtoCartBtn);
		}
		expect(postCartMock).toHaveBeenCalledTimes(7);
		postCartMock.mockReset();
	});
	test("rendering 1st product and displaying its quantity and add & minus button functionality", async () => {
		let productContainer;
		await act(async () => {
			const { container } = await render(
				<ProductItem
					id={productId}
					category={product.category}
					name={product.name}
					price={product.price}
					image={product.image}
					qty={quantity}
					isDisabled={false}
					setIsDisabled={setIsDisabledMock}
				/>
			);
			productContainer = container;
		});

		const qtyElement = screen.getByText(/[1-9] qty\./i);
		const MinusButton = productContainer!.querySelector(
			".cart__qty-container button:first-child"
		);
		const AddButton = productContainer!.querySelector(
			".cart__qty-container button:last-child"
		);

		//Checking quantity container is rendered successfully

		expect(qtyElement).toBeInTheDocument();
		expect(AddButton).toBeInTheDocument();
		expect(MinusButton).toBeInTheDocument();

		// now checking quantity container's functionality

		await userEvent.click(AddButton);
		expect(postCartMock).toHaveBeenCalledTimes(1);

		await userEvent.click(MinusButton);
		expect(deleteCartQtyMock).toHaveBeenCalledTimes(1);

		// screen.debug();
	});

	test("if quantity is 0 then do not render qty container", async () => {
		await act(async () => {
			await render(
				<ProductItem
					id={productId}
					category={product.category}
					name={product.name}
					price={product.price}
					image={product.image}
					qty={0}
					isDisabled={false}
					setIsDisabled={setIsDisabledMock}
				/>
			);
			const qtyElement = screen.queryByText(/[1-9] qty\./i);
			expect(qtyElement).not.toBeInTheDocument();
		});
	});
});