// Connect to MongoDB
const {MongoClient} = require('mongodb');

// MongoDB database URL and port
const url = 'mongodb://localhost:27017';
const dbName = 'userWorkout';

// Function to execute the query
async function executeQuery() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Successfully connected to the database');

        const db = client.db(dbName);

        // Query for data aggregation
        const pipeline = [
            {
                $group: {
                    _id: {
                        userId: '$created.userId',
                        workoutType: '$workoutType',
                        month: {$month: '$created.timestamp'},
                        plannedBy: {
                            $cond: [
                                {$eq: ['$userId', '$created.userId']},
                                'User',
                                'Coach'
                            ]
                        }
                    },
                    segmentCount: {$sum: {$size: '$segments'}}
                }

            }
        ];


        const result = await db.collection('mats-workout.userWorkout').aggregate(pipeline).toArray();
        console.log('Result of the query:', result);
    } catch (err) {
        console.error('Error executing the query:', err);
    } finally {
        await client.close();
        console.log('Closed connection to the database');
    }
}

// Call the function to execute the query
executeQuery();