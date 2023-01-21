<script lang="ts">
	let roomNumber: String;
</script>

<div class="columns">
	<div class="column is-offset-one-quarter is-three-fifths is-flex is-align-items-center">
		<div class="container is-flex is-justify-content-center">
			<div class="box notification is-primary">
				<form method="POST" action="/?/createNewRoom">
					Create a <button class="is-size-6">New room</button>
				</form>
				<p>Or join existing</p>
				<!-- todo: if room not exist, do not redirect and write error in form -->
				<form action="/room/{roomNumber}">
					<input type="text" bind:value={roomNumber} />
					<button disabled={!roomNumber} class="is-size-6">Connect room</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.columns {
		height: 100%;
	}
</style>
