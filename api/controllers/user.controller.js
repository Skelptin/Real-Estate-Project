export const test = (req, res) => {
  res.json({
    message: "Hello World",
  });
};

export const hello = (req, res) => {
  res.send("Hello Wolrd");
};
