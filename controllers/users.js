const User = require('../models/user');

function usersIndex(req, res, next) {
  User
    .find()
    .exec()
    .then((users) =>{
      console.log( users);
      res.status(200).json(users);
    })
    .catch(next);
}

function usersShow(req, res, next) {

  User
    .findById(req.params.id)
    .populate('favorites')
    .exec()
    .then(user => {
      console.log(user);
      if (!user) return res.status(404).json({ message: 'user not found' });
      return res.status(200).json(user);
    })
    .catch(next);
}

// function rateBar(req, res, next) {
//   User
//     .findById(req.params.id)
//     .exec()
//     .then( user => {
//       if (!user) return res.status(404).json({message: 'user not found'});
//
//       // kill off existing rating (if it's in there)
//       user.barRatings = user.barRatings.filter(barRating => `${barRating.barId}` !== `${req.body.barId}`);
//
//       // always add a new one
//       const newRating = {
//         barId: req.body.barId,
//         stars: req.body.stars
//       };
//       user.barRatings.push(newRating);
//
//       user.save();
//
//       return res.status(200).json(user);
//     })
//     .catch(next);
// }

function usersFavorite(req, res, next) {
  console.log(req.body);

  User
    .findById(req.params.id)
    .exec()
    .then(user => {
      if (!user) return res.status(404).json({ message: 'user not found' });

      const bar = user.favorites.find(favorite => `${favorite}` === `${req.body.favBar}`);

      if (!bar){
        user.favorites.push(req.body.favBar);
        console.log(req.body.favBar);
      } else {
        user.favorites.splice(user.favorites.indexOf(bar), 1);
      }
      user.save();
      console.log(user);

      return res.status(200).json(user);
    })
    .catch(next);
}

function usersUpdate(req, res, next) {
  console.log(req.body);

  User
    .findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    .exec()
    .then(user => {
      if (!user) return res.status(404).json({ message: 'user not found' });
      return res.status(200).json(user);
    })
    .catch(next);
}

function usersDelete(req, res, next) {
  User
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(() => {
      return res.status(200).json({ message: 'user successfully deleted!' });
    })
    .catch(next);
}


module.exports = {
  index: usersIndex,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete,
  favorite: usersFavorite
};
