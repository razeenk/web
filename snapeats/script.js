$("#submit-form").submit((e) => {
    e.preventDefault(); // Prevent default form submission

    const restaurantName = $("#res").val(); // Get restaurant name

    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxPcYgiAcP830J643N_PCHPrz2ndrgGPSf1WYpRWdyyuohqjDWBLxnfyEC6smP9aapF/exec", // Add your endpoint URL here
        data: $("#submit-form").serialize(),
        method: "post",
        success: function (response) {
            window.location.href = `thankyou.html?restaurant=${encodeURIComponent(restaurantName)}`; // Redirect with restaurant name
        },
        error: function (err) {
            alert("Something went wrong");
        }
    });
});