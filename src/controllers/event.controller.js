import { getConnection } from "./../database/database"

const getEvents = async (req, res) => {
    try {
        const connection = await getConnection();
        const result = await connection.query("SELECT e.id, e.eventName, e.dateOfEvent, e.detail, e.isFinish,  e.userCreatorId, (select count(*) from evenHasParticipant where eventId = e.id) " + 
        "as participants  FROM eventList e");
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const getEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT id, eventName, dateOfEvent, detail, isFinish, userCreatorId FROM eventList WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

const addEvent = async (req, res) => {
    try {
        const { eventName, dateOfEvent, detail, isFinish, userCreatorId } = req.body;

        const event = { eventName, dateOfEvent, detail, isFinish, userCreatorId };
        const connection = await getConnection();
        await connection.query("INSERT INTO eventList SET ?", event);
        res.json({ message: "Evento registrado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventName, dateOfEvent, detail, isFinish, userCreatorId } = req.body;

        const event = { eventName, dateOfEvent, detail, isFinish, userCreatorId };
        const connection = await getConnection();
        await connection.query("UPDATE eventList SET ? WHERE id = ?", [event, id]);
        res.json({ message: "Evento editado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = await getConnection();
        const delAuxTable = await connection.query("DELETE FROM evenHasParticipant WHERE eventId = ?", id);
        const result = await connection.query("DELETE FROM eventList WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const finishEvent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const connection = await getConnection();
        const result = await connection.query("UPDATE eventList SET isFinish = 0 WHERE id = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const addParticipant = async (req, res) => {
    try {
        const { eventId, userId } = req.body;

        const eventParticipant = { eventId, userId };
        const connection = await getConnection();
        await connection.query("INSERT INTO evenHasParticipant SET ?", eventParticipant);
        res.json({ message: "Participante Registrado" });
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const removeParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.params;
        
        const connection = await getConnection();
        const result = await connection.query("DELETE FROM evenHasParticipant WHERE eventId = ? AND userId = ?", [id, userId]);
        res.json({message: "Participante Removido"});
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
};

const getEventsParticipant = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        const result = await connection.query("SELECT e.id, e.eventId, e.userId FROM evenHasParticipant e WHERE userId = ?", id);
        res.json(result);
    } catch (error) {
        res.status(500);
        res.send(error.message);
    }
}

export const methods = {
    getEvents,
    getEvent,
    addEvent,
    updateEvent,
    deleteEvent,
    finishEvent,
    addParticipant,
    removeParticipant,
    getEventsParticipant
};
