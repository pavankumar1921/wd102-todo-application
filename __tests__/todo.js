const request = require("supertest");
var cheerio = require("cheerio");

const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    // try {
      await db.sequelize.close();
      server.close();
    // } catch (error) {
    //   console.log(error);
    // }
  });

  test("Creates a new todo ", async () => {
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy a boat",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
  //   expect(response.header["content-type"]).toBe(
  //     "application/json; charset=utf-8"
  //   );
  //   const parsedResponse = JSON.parse(response.text);
  //   expect(parsedResponse.id).toBeDefined();
  // });

  test("Marking todo as complete", async () => {
  //  try{
     let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    await agent.post("/").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    const status = latestTodo.completed ? false : true;
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const response = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: status,
      });
    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  //  }catch(error) {
  //   console.log(error);
  //  }
  })
   test("Marking todo as incomplete", async () => {
    // try{
      let res = await agent.get("/");
      let csrfToken = extractCsrfToken(res);
      await agent.post("/todos").send({
      title: "Buy pen",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedTodoResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
    const dueTodayCount = parsedGroupedResponse.dueToday.length;
    const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];
    const status = latestTodo.completed ? true : false;
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    const response = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken,
        completed: status,
      });
    const parsedUpdateResponse = JSON.parse(response.text);
    expect(parsedUpdateResponse.completed).toBe(false);
    // }catch(error) {
    //  console.log(error);
    // }
  });
    //   const parsedResponse = JSON.parse(response.text);
    //   const todoID = parsedResponse.id;

    //   expect(parsedResponse.completed).toBe(false);

    //   const markCompleteResponse = await agent
    //     .put(`/todos/${todoID}/markASCompleted`)
    //     .send();
    //   const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    //   expect(parsedUpdateResponse.completed).toBe(true);
    // });

    //   test("Fetches all todos in the database using /todos endpoint", async () => {
    //     await agent.post("/todos").send({
    //       title: "Buy xbox",
    //       dueDate: new Date().toISOString(),
    //       completed: false,
    //     });
    //     await agent.post("/todos").send({
    //       title: "Buy ps3",
    //       dueDate: new Date().toISOString(),
    //       completed: false,
    //     });
    //     const response = await agent.get("/todos");
    //     const parsedResponse = JSON.parse(response.text);

    //     expect(parsedResponse.length).toBe(4);
    //     expect(parsedResponse[3]["title"]).toBe("Buy ps3");
   

    test("Delete a todo with ID", async () => {
        let res = await agent.get("/");
      let csrfToken = extractCsrfToken(res);
      await agent.post("/todos").send({
        title: "Buy a Tie",
        dueDate: new Date().toISOString(),
        completed: false,
        _csrf: csrfToken,
      });
      const groupedTodoResponse = await agent
        .get("/")
        .set("Accept", "application/json");
      const parsedGroupedResponse = JSON.parse(groupedTodoResponse.text);
      const dueTodayCount = parsedGroupedResponse.dueToday.length;
      const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

      res = await agent.get("/");
      csrfToken = extractCsrfToken(res);

      const response = await agent.delete(`/todos/${latestTodo.id}`).send({
        _csrf: csrfToken,
      });
      const parsedDeleteResponse = JSON.parse(response.text);
      expect(parsedDeleteResponse.success).toBe(true);
    });
  });
  //   const parsedResponse = JSON.parse(response.text);
      //   const todoID = parsedResponse.id;

      //   const deletedTodoResponse = await agent.destroy(`/todos/${todoID}`).send();
      //   const parsedDeletedResponse = JSON.parse(deletedTodoResponse.text);
      //   expect(parsedDeletedResponse).toBe(true);