const convertToFeatureCollection = (locations) => {
  return {
    type: "FeatureCollection",
    features: locations.map(location => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude]
      },
      properties: { ...location }
    }))
  };
};