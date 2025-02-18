import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
// import './tasks.data.json';

const tasksData = JSON.parse(fs.readFileSync('./tasks.data.json', 'utf-8'));

const updatedTasks = tasksData.map(task => ({
    ...task,
    id_activity: uuidv4()
}));

fs.writeFileSync('./tasks.data.json', JSON.stringify(updatedTasks, null, 2));
