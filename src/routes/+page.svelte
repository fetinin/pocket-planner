<script lang="ts">
	let roomNumber: String;
</script>

<div class="columns">
	<div class="column is-offset-one-quarter is-three-fifths">
		<div class="box">
			<form method="POST" action="/?/createNewRoom">
				<button>New room</button>
			</form>
		</div>
		<div class="box">
			<input type="text" bind:value={roomNumber}/>
			<a href="/room/{roomNumber}"><button disabled={!roomNumber}>Connect room</button></a>
		</div>
	</div>
</div>
