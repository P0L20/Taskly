import Project from "../models/Project.js";
import Task from "../models/Task.js";

// GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/:id/tasks
export const getProjectTasks = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const tasks = await Task.find({ projectId: req.params.id }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id
// Design choice: unassign the project's tasks rather than deleting them,
// so you never lose task data just because a project was removed.
// If you'd rather cascade-delete instead, swap the updateMany for
// Task.deleteMany({ projectId: req.params.id }).
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await Task.updateMany({ projectId: req.params.id }, { $set: { projectId: null } });
    res.json({ message: 'Project deleted, its tasks were unassigned', id: req.params.id });
  } catch (err) {
    next(err);
  }
};