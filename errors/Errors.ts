class InvalidInputError extends Error {
    message = 'Invalid input data: name or type are invalid.'
}

class DatabaseError extends Error {
    message = 'Database Error: An error occurred while accessing the database.'
}

class FindError extends Error {
    message = "Find Error: No pokemon with the the passed name was found in the database."
}


module.exports = {
    InvalidInputError,
    DatabaseError,
    FindError,
};