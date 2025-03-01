module.exports = {
  async createTestPayment(ctx) {
    try {
      const { amount } = ctx.request.body;
      
      // Generate a unique test payment ID
      const paymentIntentId = `pi_test_${Date.now()}`;
      
      ctx.send({
        paymentIntentId,
        amount,
        status: 'requires_payment',
      });
    } catch (error) {
      ctx.throw(500, error);
    }
  },
};