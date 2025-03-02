module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/api/create-test-payment',
      handler: 'payment.createTestPayment',
      config: {
        policies: [],
        description: 'Create a test payment intent',
      },
    },
  ],
};