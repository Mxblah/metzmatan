require 'asciidoctor-pdf'

# Initial variable declarations
version = ''
sourcePath = "#{__dir__}/../rules/main.adoc"

# Walk the main asciidoc file to find the version number (it's very near the top so this should be fast)
File.open(sourcePath) do |file|
    file.each_line do |line|
        if (line.match?(/:revnumber:/))
            version = line.gsub(':revnumber: ', '').strip()
        end
    end
end
outputPath = "#{__dir__}/../rules/metzmatan-test-rulebook-#{version}.pdf"

# Build the actual pdf. "Unsafe" actually just means "resolve include directives" instead of just leaving them as links
puts "Building rulebook pdf from primary source file '#{sourcePath}' with version #{version}"
Asciidoctor.convert_file sourcePath, backend: 'pdf', safe: :unsafe, to_file: outputPath

puts "Complete! Generated '#{outputPath}'"
