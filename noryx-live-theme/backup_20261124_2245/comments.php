<?php
/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package noryx
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if (post_password_required()) {
	return;
}
?>

<div id="comments" class="blog-details-comments-wrap mb-40">

	<?php
	// You can start editing here -- including this comment!
	if (have_comments()):
		?>
		<div class="post-comments">
			<h5 class="comments-title ftc-heading-1">
				<?php
				$noryx_comment_count = get_comments_number();
				if ('1' === $noryx_comment_count) {
					printf(
						/* translators: 1: title. */
						esc_html__('1 Comment', 'noryx'),
						'<span>' . wp_kses_post(get_the_title()) . '</span>'
					);
				} else {
					printf(
						/* translators: 1: comment count number, 2: title. */
						esc_html(_nx('%1$s Comment', '%1$s Comments', $noryx_comment_count, 'comments title', 'noryx')),
						number_format_i18n($noryx_comment_count), // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						'<span>' . wp_kses_post(get_the_title()) . '</span>'
					);
				}
				?>
			</h5><!-- .comments-title -->
			<?php the_comments_navigation(); ?>
			<div class="comments-box-wrap mb-20">
				<ol class="comment-list list-unstyled mb-0">
					<?php
					wp_list_comments(
						array(
							'callback' => 'noryx_comments'
						)
					);
					?>
				</ol><!-- .comment-list -->
			</div>


		</div>
		<?php
		the_comments_navigation();

		// If comments are closed and there are comments, let's leave a little note, shall we?
		if (!comments_open()):
			?>
			<p class="no-comments">
				<?php esc_html_e('Comments are closed.', 'noryx'); ?>
			</p>
			<?php
		endif;

	endif; // Check for have_comments().
	?>
</div><!-- #comments -->
<?php
$args = array(
	'comment_notes_after' => '
	<div class="nx-btn1 ver_2">
		<button>
			<i>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M7.31754 7.31754L1.06753 13.5675C0.95026 13.6848 0.7912 13.7507 0.625347 13.7507C0.459495 13.7507 0.300435 13.6848 0.18316 13.5675C0.0658846 13.4503 3.26935e-09 13.2912 0 13.1253C-3.26935e-09 12.9595 0.0658846 12.8004 0.18316 12.6832L5.99175 6.87535L0.18316 1.06753C0.0658846 0.95026 0 0.7912 0 0.625347C0 0.459495 0.0658846 0.300435 0.18316 0.18316C0.300435 0.0658846 0.459495 0 0.625347 0C0.7912 0 0.95026 0.0658846 1.06753 0.18316L7.31754 6.43316C7.37565 6.49121 7.42175 6.56014 7.4532 6.63601C7.48465 6.71188 7.50084 6.79321 7.50084 6.87535C7.50084 6.95748 7.48465 7.03881 7.4532 7.11469C7.42175 7.19056 7.37565 7.25949 7.31754 7.31754ZM13.5675 6.43316L7.31754 0.18316C7.20026 0.0658846 7.0412 0 6.87535 0C6.7095 0 6.55044 0.0658846 6.43316 0.18316C6.31588 0.300435 6.25 0.459495 6.25 0.625347C6.25 0.7912 6.31588 0.95026 6.43316 1.06753L12.2418 6.87535L6.43316 12.6832C6.31588 12.8004 6.25 12.9595 6.25 13.1253C6.25 13.2912 6.31588 13.4503 6.43316 13.5675C6.55044 13.6848 6.7095 13.7507 6.87535 13.7507C7.0412 13.7507 7.20026 13.6848 7.31754 13.5675L13.5675 7.31754C13.6256 7.25949 13.6717 7.19056 13.7032 7.11469C13.7347 7.03881 13.7508 6.95748 13.7508 6.87535C13.7508 6.79321 13.7347 6.71188 13.7032 6.63601C13.6717 6.56014 13.6256 6.49121 13.5675 6.43316Z" fill="white"/>
				</svg>
			</i>
			<span>
				' . esc_html__('Post Comment', 'noryx') . '
			</span>
		</button>
	</div>'

);
?>
<div class="fx-form-1">
	<?php comment_form($args); ?>
</div>