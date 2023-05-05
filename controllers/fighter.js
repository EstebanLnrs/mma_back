// Import du modèle fighter
var Fighter = require("../models/fighter");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const fighterValidationRules = () => {
    return [
        body("firstName")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("First name must be specified.")
            .isAlphanumeric()
            .withMessage("First name has non-alphanumeric characters."),

        body("surname")
            .trim()
            .isLength({ min: 1 }),


        body("lastName")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Last name must be specified.")
            .isAlphanumeric()
            .withMessage("Last name has non-alphanumeric characters."),

        body("organisation")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("oRGANISATION must be specified.")
            .isAlphanumeric()
            .withMessage("Organisations has non-numeric characters."),

        body("dateOfBirth", "Invalid date of birth")
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate()
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

// Create
exports.create = [bodyIdValidationRule(), fighterValidationRules(), checkValidity, (req, res, next) => {

    // Création de la nouvelle instance de fighter à ajouter 
    var fighter = new Fighter({
        _id: req.body.id,
        firstName: req.body.firstName,
        surname: req.body.surname,
        lastName: req.body.lastName,
        organisation: req.body.organisation,
        dateOfBirth: req.body.dateOfBirth,
    });

    // Ajout de fighter dans la bdd 
    fighter.save().then((result) => {
        return res.status(201).json(result);
    }).catch((err) => {
        return res.status(500).json(err);
    });
}];

// Read
exports.getAll = (req, res, next) => {
    Fighter.find()
        .populate("organisation")
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json(err);
        })

};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Fighter.findById(req.params.id)
        .populate("organisation")
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });
}];

// Update
exports.update = [paramIdValidationRule(), fighterValidationRules(), checkValidity, (req, res, next) => {
    var fighter = new Fighter({
        _id: req.body.id,
        firstName: req.body.firstName,
        surname: req.body.surname,
        lastName: req.body.lastName,
        organisation: req.body.organisation,
        dateOfBirth: req.body.dateOfBirth,
    });

    Fighter.findByIdAndUpdate(req.params.id, fighter).exec().then(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        if (!result) {
            res.status(404).json("Student with id " + req.params.id + " is not found !");
        }
        return res.status(201).json("Student updated successfully !");
    });
}];


// Delete
exports.delete = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Fighter.findByIdAndRemove(req.params.id).then((result) => {
        if (!result) {
            res.status(404).json("Fighter with id " + req.params.id + " is not found !");
        }
        return res.status(200).json("Fighter deleted successfully !");
    }).catch((err) => {
        return res.status(500).json(err);
    });
}];