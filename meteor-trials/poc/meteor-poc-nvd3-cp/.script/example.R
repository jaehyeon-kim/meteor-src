breaks <- as.integer(commandArgs(TRUE)[1])

hist_obj <- hist(faithful[, 2], breaks = breaks)
labels <- hist_obj$breaks
values <- hist_obj$counts
min_len <- min(length(labels), length(values))
hist_df <- data.frame(label = as.character(labels[1:min_len]), value = values[1:min_len])

lst <- list()
lst[[length(lst) + 1]] <- list(values = hist_df)
print(jsonlite::toJSON(lst))
