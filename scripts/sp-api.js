const SellingPartner = require("amazon-sp-api");

(async () => {
  try {
    const spClient = new SellingPartner({
      region: "eu", // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token: "Atzr|IwEBINNfCmA0e5TynuI3y1pvzjyBpdP1is2p_jbNpOaeJmIcjvZvkgDwBvgC0Q0B97PUJ5pKwhLoab_7RoAKLV_wCL6_2PfNkZ4_3DKODCNdWSRFjgFls3mGBAqs5iciTMI0b3PD0f5JUvqIgFEEYPjLoAqzuerCNjxLJXqT_wtTrOu0faDoWxxe8bl6WIt9_w_dKXejlSQOfEPJNUEpakV6al1HlMQlVLfCR2K27nTfixemqdbRVqvY2gbbDxeIxUYogQ2QWPkENEL0NUxeFGyOEmc-V2q9fQ3qmGOTAmRNv_8JYhjFF1rvGbBVgq8mLm_U-BA" // The refresh token of your app user
    });
    let res = await spClient.callAPI({
      operation: "getMarketplaceParticipations",
      endpoint: "sellers"
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
})();