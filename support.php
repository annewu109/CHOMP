<?php include 'header.php'; ?>
<div style="padding: 20px; max-width: 600px; margin: auto;">
  <h2>Support</h2>
  <p>Need help? Send us a message and we’ll get back to you as soon as possible.</p>
  <form action="send_support.php" method="post">
    <label for="name">Name:</label><br>
    <input type="text" id="name" name="name" required><br><br>

    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br><br>

    <label for="message">Message:</label><br>
    <textarea id="message" name="message" rows="5" required></textarea><br><br>

    <input type="submit" value="Submit">
  </form>
</div>
<?php include 'footer.php'; ?>
