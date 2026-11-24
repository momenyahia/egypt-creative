<?php
/**
 * The template for displaying search results pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package noryx
 */

get_header();
$noryxPostClass = '';
if (is_active_sidebar('sidebar-1')) {
	$noryxPostClass = 'col-xxl-8 col-xl-8 col-lg-8';
} else {
	$noryxPostClass = 'col-lg-10 offset-lg-1';
}
?>
<section id="sn-blog-list" class="sn-blog-list-sec pt-130 pb-110">
	<div class="container">
		<div class="row">
			<div class="<?php echo esc_attr($noryxPostClass); ?>">
				<?php noryx_search_loop(); ?>
			</div>
			<?php get_sidebar(); ?>
		</div>
	</div>
</section>

<?php
get_footer();
