import Task from "../models/Task.js";

// GET /api/tasks
// Supports optional query filters: ?status=&projectId=&from=&to=
export const getTasks = async (req, res, next) => {
  try {
    const { status, projectId, from, to } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (projectId) filter.projectId = projectId;

    if (from || to) {
      filter.dueDate = {};
      if (from) filter.dueDate.$gte = new Date(from);
      if (to) filter.dueDate.$lte = new Date(to);
    }

    const tasks = await Task.find(filter).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getGroupedTask = async (req, res, next) => {
  try {
    const groupedTasks = await Task.aggregate([
      {
        $group: {
          _id: "$status",
          tasks: { $push: "$$ROOT" },
        },
      },
    ]);

    const result = Object.fromEntries(
      groupedTasks.map(group => [group._id, group.tasks])
    );

    res.json(result);
  } catch (e) {
    next(e);
  }
};

// GET /api/tasks/:id
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks
export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,           // return the updated document
      runValidators: true, // enforce schema validation on update
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};