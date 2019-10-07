const DataSource = {
  addChangeListener (callback) {
    console.log("addChangeListener");
  },
  removeChangeListener (callback) {
    console.log("removeChangeListener");
  },
  getComments () {
    return [
      "评论1",
      "评论2",
      "评论3"
    ]
  },
  getBlogPost (id) {
    console.log("getBlogPost");
  }
};

export default DataSource