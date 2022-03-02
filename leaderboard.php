<?php 
    include('./db/DB.php');

    $db = new DB();
    $result = $db->execute_query("SELECT web2_saves.*, web2_users.username FROM web2_saves LEFT JOIN web2_users ON web2_saves.user_id = web2_users.id ORDER BY saved_at DESC");
    if($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            ?>
            <div class="card border-custom bg-transparent mt-4">
                <div class="card-body fs-5 p-0">
                    <h5 class="card-header border-custom d-flex justify-content-between "><span><?= $row['username'] ?></span> <span><?= $row['saved_at'] ?></span></h5>
                    <p class="card-text mt-3 p-3"><?= $row['review'] ?? "<span class='text-danger'>No review submitted!</span>" ?></p>
                    <div class="card-footer bg-transparent border-custom">Kills: <?= $row['kills'] ?></div>
                </div>
            </div>
            <?php
        }
    } else {
        echo "<div class='w-100 text-center text-danger'>No data available!</div>";
    }
?>