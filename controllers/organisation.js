// Import du modèle fighter
var Organisation = require("../models/organisation");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const organisationValidationRules = () => {
    return [
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified.")
            .isAlphanumeric()
            .withMessage("Name has non-alphanumeric characters."),
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
exports.create = [bodyIdValidationRule(), organisationValidationRules(), checkValidity, (req, res, next) => {

    // Création de la nouvelle instance de fighter à ajouter 
    var organisation = new Organisation({
        _id: req.body.id,
        name: req.body.name,
    });

    // Ajout de fighter dans la bdd 
    organisation.save().then((result) => {
        return res.status(201).json(result);
    }).catch((err) => {
        return res.status(500).json(err);
    });
}];

// Read
exports.getAll = (req, res, next) => {
    Organisation.find()
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((err) => {
            return res.status(500).json(err);
        })

};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Organisation.findById(req.params.id)
        .exec()
        .then((result) => {
            return res.status(200).json(result);
        }).catch((err) => {
            return res.status(500).json(err);
        });
}];

// Update
exports.update = [paramIdValidationRule(), organisationValidationRules(), checkValidity, (req, res, next) => {
    var organisation = new Organisation({
        _id: req.body.id,
        name: req.body.name,
    });

    Organisation.findByIdAndUpdate(req.params.id, organisation).exec().then(function (err, result) {
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
    Organisation.findByIdAndRemove(req.params.id).then((result) => {
        if (!result) {
            res.status(404).json("Fighter with id " + req.params.id + " is not found !");
        }
        return res.status(200).json("Fighter deleted successfully !");
    }).catch((err) => {
        return res.status(500).json(err);
    });
}];