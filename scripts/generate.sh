#!/bin/bash

# This function demonstrates how to form a URL based on a command choice and SKU.
visit_url_with_sku() {
  local sku="$1"
  local command="$2"
  
  case "$command" in
    'templates')
      url="http://localhost:3000/api/template?tpl=rs-captab&multiLang=true&sku=${sku}"
      ;;
    'pouches')
      url="http://localhost:3000/api/template?"
      ;;
    'command3')
      url="https://api./v1/product/${sku}"
      ;;
    'command4')
      url="http://shop.?product_sku=${sku}&details=true"
      ;;
    *)
      echo "Invalid command. Available commands: command1, command2, command3, command4"
      exit 1
      ;;
  esac

  echo "Visiting URL: $url"
  curl "$url"
}

main() {
  if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <command> <csv_file_path>"
    exit 1
  fi

  local command="$1"
  local csv_file="$2"

  # Verify that the CSV file exists
  if [ ! -f "$csv_file" ]; then
    echo "Error: CSV file not found at $csv_file"
    exit 1
  fi

  # Read the CSV line by line
  while IFS=',' read -r sku || [ -n "$sku" ]; do
    visit_url_with_sku "$sku" "$command"
    # echo $sku;
  done < "$csv_file"

  echo "Operation completed."
}

main "$@"