$(document).ready(() => {
  const students = [
    "muneerabaz",
    "MohammedAlghamdi3",
    "Mohrah-Alateeq",
    "Rawandahli",
    "arfajraa",
    "hananalshammary",
    "khalidnt",
    "AlanoudBinSalamah",
    "layalkashgari",
    "khalid1434",
    "hamad-SHE",
    "jalharbi",
    "shuunz",
    "morojAlh",
    "abdulrabbt",
    "Gothamey",
    "MayMo7a",
    "aishah21",
    "Nalghamdi",
    "talomari01",
    "NawafI",
    "SultanBS",
    "Bader1011",
    "Masarsah",
    "hamoudsa",
    "YA7MO",
    "Marwah14",
    "nadaabdulkarem"
  ];

  const getHwRepos = () => {
    const url = `https://api.github.com/search/repositories?q=hw-w0+user:WDI-HoneyBadger&sort=updated&order=asc`;
    fetch(url)
      .then(response => response.json())
      .then(repos => {
        filterRepos(repos);
      })
      .catch(error => console.log(error));
  };

  const getPulls = url => {
    fetch(url)
      .then(response => response.json())
      .then(pulls => {
        renderPulls(pulls);
      })
      .catch(error => console.log(error));
  };

  const checkeHw = (hw, query) => {
    return !query.reduce((acc, curr) => {
      return acc
        ? acc
        : hw.indexOf(curr) > -1 || hw.indexOf(curr.toUpperCase()) > -1;
    }, false);
  };

  const filterRepos = repos => {
    return repos.items.filter(repo => {
      if (checkeHw(repo.name, ["w01", "w02"])) {
        renderRepo(repo);
        getPulls(
          `https://api.github.com/repos/${repo.full_name}/pulls?state=all`
        );
      }
    });
  };
  const renderPulls = pulls => {
    let dueDate = new Date(pulls[0].base.repo.created_at.slice(0, 10));
    let submittedStudents = [];
    const $tbody = $(`#${pulls[0].base.repo.id}`);

    if (dueDate.getDay() === 4) {
      dueDate.setDate(dueDate.getDate() + 2);
    }
    pulls.forEach(pull => {
      // $userAvatar = $("<img/>");
      const $tr = $("<tr>");
      const $th = $("<th>");
      $("<a>")
        .attr("href", `https://github.com/${pull.user.login}`)
        .text(pull.user.login)
        .appendTo($th);

      $th.appendTo($tr);

      $("<th>")
        .text(pull.created_at)
        .appendTo($tr);

      $("<th>")
        .text(pull.closed_at)
        .appendTo($tr);

      let submissionDate = new Date(pull.created_at.slice(0, 10));
      pull.closed_at != null
        ? $tr.attr("class", "success")
        : $tr.attr("class", "info");

      if (
        pull.created_at != null &&
        submissionDate > dueDate &&
        pull.closed_at != null
      ) {
        $tr.attr("class", "warning");
      }

      submittedStudents.push(pull.user.login);
      $tr.appendTo($tbody);
    });

    const missingSubmission = students.filter(
      value => -1 === submittedStudents.indexOf(value)
    );

    if (missingSubmission.length > 0) {
      missingSubmission.forEach(student => {
        const $tr = $("<tr>").attr("class", "danger");

        const $th = $("<th>");
        $("<a>")
          .attr("href", `https://github.com/${student}`)
          .text(student)
          .appendTo($th);

        $th.appendTo($tr);

        $("<th>")
          .text("missing!")
          .appendTo($tr);
        $("<th>")
          .text("")
          .appendTo($tr);
        $tr.appendTo($tbody);
      });
    }
  };
  const renderRepo = repo => {
    const $repo = $("<div>").attr("class", "container bg-light");

    $("<h2>")
      .text(repo.name)
      .appendTo($repo);
    $("<h3>")
      .text(repo.created_at)
      .appendTo($repo);

    // const $creationDate = $("<h2>")
    //   .text("Created At " + repo.created_at)
    //   .appendTo($repo);
    // const $numberOfForks = $("<h2>")
    //   .text("forks " + repo.forks)
    //   .appendTo($repo);

    $(`
      <table class="table">
        <thead>
          <tr>
            <th>UserName</th>
            <th>Submission Date</th>
            <th>Complete Date</th>
          </tr>
        </thead>
        <tbody id=${repo.id}>
      
        </tbody>
      </table>`).appendTo($repo);
    $repo.appendTo("#result");
  };

  getHwRepos();
});
