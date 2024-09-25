const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  //TODO: complete the schema//include user stats
});

//NOTE: will intergrate password hashing with bcrypt later in development
