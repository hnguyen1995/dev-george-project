let ideaData = [];

$(document).ready(function () {
  console.log("BrainstormBoard ready!");

  // Load initial data
  fetch('data/data.json')
    .then(res => res.json())
    .then(data => {
      ideaData = data;
      renderIdeas();
    });

  // Dummy login
  $('#loginForm').submit(function (e) {
    e.preventDefault();
    const name = $('#username').val();
    $('#userGreeting').text(`Welcome, ${name}!`);
    $('#loginBtn').text('Logout').removeAttr('data-bs-toggle').click(() => location.reload());
    $('#loginModal').modal('hide');
  });

  // Add new idea
  $('#ideaForm').submit(function (e) {
    e.preventDefault();
    const newIdea = {
      id: Date.now(),
      title: $('#ideaTitle').val(),
      description: $('#ideaDescription').val()
    };
    ideaData.push(newIdea);
    renderIdeas();
    this.reset();
  });

  // Load sample data
  $('#loadSampleBtn').click(function () {
    $('#ideaTitle').val("Sample Idea");
    $('#ideaDescription').val("This is a pre-filled sample idea description.");
  });

  // Export data
  $('#exportBtn').click(function () {
    const exportData = JSON.stringify(ideaData, null, 2);
    console.log("Exported Data:", exportData);
  });
});

function renderIdeas() {
  $('#ideaList').empty();
  ideaData.forEach(item => {
    const card = $(`
      <div class="col-md-6">
        <div class="card">
          <div class="card-body" data-id="${item.id}">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.description}</p>
            <button class="btn btn-sm btn-outline-warning editBtn">Edit</button>
            <button class="btn btn-sm btn-outline-danger deleteBtn">Delete</button>
          </div>
        </div>
      </div>
    `);
    $('#ideaList').append(card);
  });

  $('.editBtn').click(function () {
    const parent = $(this).closest('.card-body');
    const id = Number(parent.data('id'));
    const item = ideaData.find(i => i.id === id);

    const newTitle = prompt("Edit title:", item.title);
    const newDesc = prompt("Edit description:", item.description);

    if (newTitle !== null && newDesc !== null) {
      item.title = newTitle;
      item.description = newDesc;
      renderIdeas();
    }
  });

  $('.deleteBtn').click(function () {
    if (confirm("Are you sure you want to delete this idea?")) {
      const id = Number($(this).closest('.card-body').data('id'));
      ideaData = ideaData.filter(i => i.id !== id);
      renderIdeas();
    }
  });
}
