const Workplace = require("../../models/Workplace");

module.exports = {
  async difficult() {
    const names = [
      "Divisional Secretariat, Pothuvil",
      "Divisional Secretariat, Lahugala",
      "Divisional Secretariat, Dehiaththakandiya",
      "Divisional Secretariat, Padiyathalawa",
      "Divisional Secretariat, Mahaoya",
    ];
    const workplaces = await Workplace.find({ workplace: { $in: names } });
    const random = workplaces[Math.floor(Math.random() * workplaces.length)];
    return random?._id;
  },

  async moderate() {
    const names = [
      "Divisional Secretariat, Damana",
      "Divisional Secretariat, Irakkamam",
      "Divisional Secretariat, Thirukkovil",
      "Divisional Secretariat, Navithanveli",
      "Divisional Secretariat, Uhana",
      "Divisional Secretariat, Alayadivembu",
    ];
    const workplaces = await Workplace.find({ workplace: { $in: names } });
    const random = workplaces[Math.floor(Math.random() * workplaces.length)];
    return random?._id;
  },

  async prefered() {
    const names = [
      "Divisional Secretariat, Kalmunai",
      "Divisional Secretariat, Kalmunai (North)",
      "Divisional Secretariat, Sainthamaruthu",
      "Divisional Secretariat, Karathivu",
      "Divisional Secretariat, Ninthavur",
      "Divisional Secretariat, Addalachchenai",
      "Divisional Secretariat, Akkaraipaththu",
      "District Secretariat, Ampara",
      "Divisional Secretariat, Sammanthurai",
      "Divisional Secretariat, Ampara",
    ];
    const workplaces = await Workplace.find({ workplace: { $in: names } });
    const random = workplaces[Math.floor(Math.random() * workplaces.length)];
    return random?._id;
  },
};
