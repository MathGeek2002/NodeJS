var currentQuestionId = undefined;

function ChangeFormVisibility(formDivId, questionId)
{
    var currentVisibility = document.getElementById(formDivId).style.visibility;

    var newVisibility = (currentVisibility != "visible") ? "visible" : "hidden";

    document.getElementById(formDivId).style.visibility = newVisibility;

    currentQuestionId = questionId;

    var questionIdJson = {id: questionId};

    if(questionId != undefined)
    {
        fetch("/questions/findQuestion", {method:'POST', cache:'no-cache', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(questionIdJson)})
        .then(
            res => {
                var question = res.json();
                
                return question;
            }
        )
        .then(
            question => {
                document.getElementById("question").value = question.description;
                document.getElementById("ans1").value = question.answerDescription1;
                document.getElementById("ans1t").checked = question.answerValue1 == "1";
                document.getElementById("ans1f").checked = question.answerValue1 == "0";
                document.getElementById("ans2").value = question.answerDescription2;
                document.getElementById("ans2t").checked = question.answerValue2 == "1";
                document.getElementById("ans2f").checked = question.answerValue2 == "0";
                document.getElementById("ans3").value = question.answerDescription3;
                document.getElementById("ans3t").checked = question.answerValue3 == "1";
                document.getElementById("ans3f").checked = question.answerValue3 == "0";
                document.getElementById("formQuestionImage").src = question.picture;
                document.getElementById("formQuestionImage").hidden = false;

                console.log(question);
            }
        )
        .catch(error => {
            throw error;
        });
    }
    else
    {
        document.getElementById("question").value = "New question...";
        document.getElementById("ans1").value = "";
        document.getElementById("ans1f").checked = true;
        document.getElementById("ans2").value = "";
        document.getElementById("ans2f").checked = true;
        document.getElementById("ans3").value = "";
        document.getElementById("ans3f").checked = true;
        document.getElementById("formQuestionImage").src = "";
        document.getElementById("formQuestionImage").hidden = true;
    }
}

function RemoveQuestion(questionId)
{
    var questionIdJson = {id: questionId};

    fetch("/questions/removeQuestion", {method:'DELETE', cache:'no-cache', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(questionIdJson)})
    .then(
        res => {
            location.reload();
        }
    );
}

function ProcessData()
{
    var reader = new FileReader();
    var pictureFile = document.getElementById("filetoupload").files[0];

    reader.readAsDataURL(pictureFile);
    console.log(currentQuestionId);

    reader.addEventListener(
        "load",
        () => {
            
            var questionJSON =  {
                                id: currentQuestionId,
                                description: document.getElementById("question").value,
                                answerDescription1: document.getElementById("ans1").value,
                                answerValue1: document.getElementById("ans1t").checked ? "1" : "0",
                                answerDescription2: document.getElementById("ans2").value,
                                answerValue2: document.getElementById("ans2t").checked ? "1" : "0",
                                answerDescription3: document.getElementById("ans3").value,
                                answerValue3: document.getElementById("ans3t").checked ? "1" : "0",
                                picture: reader.result
                            };

            fetch("/questions/registerQuestion", {method:'POST', cache:'no-cache', Accept: 'application/json', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(questionJSON)})
            .then(res => {
                if (res.ok) 
                {
                    let outcome = res.json();
                    
                    return outcome;
                } 
                else 
                {
                    return Promise.reject("Http error:"+res.status);
                }
            })
            .then(res => {
                console.log(res);
                location.reload();
            })
            .catch(error => {
                throw error;
            });
        }
    );
}