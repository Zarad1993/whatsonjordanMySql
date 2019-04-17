var db = require('../databse');
var medicalIssuesDB = db.MedicalIssue;

db.sequelize.sync();

module.exports = medicalIssuesDB;

medicalIssuesDB.updateOrCreateMedicalIssues = updateOrCreateMedicalIssues;


function updateOrCreateMedicalIssues(issues, contactId, removedIssue){
    console.log('the removed medical: ', removedIssue);
    
    if (removedIssue){
        return medicalIssuesDB
            .destroy({ where: { id: removedIssue.id }})
            .then(function(afterDelete){
                console.log('the result of delete medical issue: ', afterDelete);
                return Promise.all(issues.map(function(issue){
                        if(issue.id){
                            return medicalIssuesDB.update(issue, {where:{id:issue.id}});
                        }else if(issue.title && issue.details){
                            issue.contactId = contactId;
                            return medicalIssuesDB.create(issue);
                        }
                    })).then(function(result){
                        return result;
                    });
            });
    }else{
        return Promise.all(issues.map(function (issue) {
            if (issue.id) {
                return medicalIssuesDB.update(issue, { where: { id: issue.id } });
            } else if (issue.title && issue.details) {
                issue.contactId = contactId;
                return medicalIssuesDB.create(issue);
            }
        })).then(function (result) {
            return result;
        });
    }
}

