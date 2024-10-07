import Customer from "../../customer/entity/customer";
import CustomerAddressChangedEvent from "../../customer/event/customer-address-changed.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import EnviaConsoleLog1Handler from "../../customer/event/handler/envia-console-log-1-handler";
import EnviaConsoleLog2Handler from "../../customer/event/handler/envia-console-log-2-handler";
import EnviaConsoleLogHandler from "../../customer/event/handler/envia-console-log-handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  describe("Customer events tests", () => {
    it("should trigger customer events when a customer is created", () => {
      const eventDispatcher = new EventDispatcher();
      const firstCustomerEventHandler = new EnviaConsoleLog1Handler();
      const secondCustomerEventHandler = new EnviaConsoleLog2Handler();
      const firstSpyEvent = jest.spyOn(firstCustomerEventHandler, "handle");
      const secondSpyEvent = jest.spyOn(secondCustomerEventHandler, "handle");

      eventDispatcher.register("CustomerCreatedEvent", firstCustomerEventHandler);
      eventDispatcher.register("CustomerCreatedEvent", secondCustomerEventHandler);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
      ).toMatchObject(firstCustomerEventHandler);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
      ).toMatchObject(secondCustomerEventHandler);

      const customerCreated = new CustomerCreatedEvent({
        name: "Product 1",
        description: "Product 1 description",
        price: 10.0,
      });

      eventDispatcher.notify(customerCreated);

      expect(firstSpyEvent).toHaveBeenCalled();
      expect(secondSpyEvent).toHaveBeenCalled();
    });

    it("should trigger event when a customer's address is changed", () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    
      const firstSpyEvent = jest.spyOn(customer.changeAddressEventHandler, "handle");
    
      customer.changeAddress(address);
    
      expect(firstSpyEvent).toHaveBeenCalled();
    });

  })


});
