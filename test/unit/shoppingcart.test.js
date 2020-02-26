var assert = require('chai').assert;

import { ShoppingCart, Product, LineItem, Shipping } from '../../src/domain';

/**
 * {@link FixedShippingQuoteService} is a utility that we can use with the {@link ShoppingCart}
 * to control how much shipping will cost (before any applicable discounts).
 */
class FixedShippingQuoteService extends Shipping.ShippingQuoteService {
	constructor(fixedCost) {
		super();
		this.cost = fixedCost;
	}

	/**
	 * Override the default implementation in {@link ShippingQuoteService#quote} to
	 * return a fixed cost regardless of the selected service.
	 */
	quote() { return this.cost; }
}

describe('ShoppingCart', () => {

	const shippingInfo = new Shipping.ShippingInfo(
		Shipping.ShippingService.USPSPriorityMail,
		"30 W 21st Street, New York, NY 10010"
	);
	const freeShippingQuoteService = new FixedShippingQuoteService(0);
	const shirt = new Product("SHIRT", "Shirt", 2500);
	const socks = new Product("SOCKS", "Crew socks", 500);
	const discountSocks = new Product("CHEAPSOCKS", "Cheap crew socks", 500, 300);

	describe('EmptyCart', () => {

		const cart = new ShoppingCart(freeShippingQuoteService);
		cart.updateShipping(shippingInfo);
		const purchase = cart.toPurchase()

		it('should be zero dollars', () => {
			assert.equal(purchase.totalPrice, 0)
		});
	});

	describe('VolumeDiscounts', () => {

		const cart = new ShoppingCart(freeShippingQuoteService);
		cart.addProduct(shirt);
		cart.updateShipping(shippingInfo);


		it('should apply a discount to a purchase over $200', () => {
			assert.equal(cart.toPurchase().totalPrice, shirt.price*0.8)
		});
		it('should apply a discount to a purchase over $100', () => {
			assert.equal(cart.toPurchase().totalPrice, shirt.price*0.9)
		});
	});

});
